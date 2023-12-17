const feedContainer = document.getElementById("feed");
const summaryBlock = document.getElementById("summary");

const getParsedFeed = async () => {
  try {
    const response = await fetch("./feed.xml");
    const xmlText = await response.text();
    return new DOMParser().parseFromString(xmlText, "text/xml");
  } catch (e) {
    return new Error(e);
  }
};

const getTagByName = (item, tagName) =>
  tagName.includes(":")
    ? item.getElementsByTagName(tagName)[0]
    : item.querySelector(tagName);

const getTagText = (item, tagName) => getTagByName(item, tagName).textContent;

const getFeedItemId = (item) => {
  const linkParts = getTagText(item, "link")
    .split("/")
    .filter((part) => part !== "");
  return linkParts[linkParts.length - 1];
};

const getFeedItemDateText = (item) => {
  const date = new Date(getTagText(item, "pubDate"));
  const formatDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
  return formatDate;
};

const getFeedItemMp3 = (item) => {
  const enclosure = getTagByName(item, "enclosure");
  return enclosure.getAttribute("data-file") === "dropbox"
    ? enclosure.getAttribute("url")
    : "";
};

const getFeedItemImage = (item) =>
  getTagByName(item, "itunes:image").getAttribute("href");

const getFeedItemData = (item) => ({
  id: getFeedItemId(item),
  title: getTagText(item, "title"),
  date: getFeedItemDateText(item),
  description: getTagText(item, "description"),
  mp3: getFeedItemMp3(item),
  image: getFeedItemImage(item),
  duration: getTagText(item, "itunes:duration"),
});

const buildAudioPlayer = (mp3) => {
  if (mp3 === "")
    return `<p class="unavailable">Sorry, this episode is not currently available.</p>`;
  return [
    `<audio controls preload="metadata">`,
    `<source src="${mp3}" type="audio/mpeg" />`,
    `<a href="${mp3}">Download episode</a>`,
    `</audio>`,
  ].join("");
};

const buildFeedItem = (item) => {
  const { id, title, date, description, mp3, image, duration } =
    getFeedItemData(item);
  const player = buildAudioPlayer(mp3);

  const feedItemContent = [
    `<img src="${image}" alt="" />`,
    `<div class="player">${player}</div>`,
    `<div class="inner">`,
    `<h2><a href="#${id}">${title}</a></h2>`,
    `<p class="meta">`,
    `<span>Duration: <strong>${duration}</strong></span>`,
    `<span aria-hidden="true"> | </span>`,
    `<span>Released: <strong>${date}</strong></span>`,
    `</p>`,
    `<p class="description">${description}</p>`,
    `<p class="download"><a href="${mp3}">Download episode</a></p>`,
    `</div>`,
  ];

  const feedItem = document.createElement("article");
  feedItem.innerHTML = feedItemContent.join("");
  feedItem.setAttribute("id", id);

  return feedItem;
};

const buildFeedSummary = (items) => {
  const summary = document.createElement("p");
  summary.textContent = `Originally aired ${items.length} episodes from 2016-2018.`;
  summary.setAttribute("id", "summary");
  return summary;
};

const buildFeedList = async () => {
  const feed = await getParsedFeed();
  const items = feed.getElementsByTagName("item");

  const feedSummary = buildFeedSummary(items);
  summaryBlock.appendChild(feedSummary);

  for (let i = 0; i < items.length; i++) {
    const feedItem = buildFeedItem(items[i]);
    feedContainer.appendChild(feedItem);
  }
};

buildFeedList();
