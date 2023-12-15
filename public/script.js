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

const getTagText = (item, tagName) => item.querySelector(tagName).textContent;

const getFeedItemId = (item) => {
  const linkParts = getTagText(item, "link")
    .split("/")
    .filter((part) => part !== "");
  return linkParts[linkParts.length - 1];
};

const getFeedItemDateText = (item) => {
  const date = new Date(getTagText(item, "pubDate"));
  const formatDate = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
  }).format(date);
  return `Released ${formatDate}`;
};

const getFeedItemMp3 = (item) =>
  item.querySelector("enclosure").getAttribute("url");

const getFeedItemImage = (item) =>
  item.getElementsByTagName("itunes:image")[0].getAttribute("href");

const getFeedItemData = (item) => ({
  id: getFeedItemId(item),
  title: getTagText(item, "title"),
  date: getFeedItemDateText(item),
  description: getTagText(item, "description"),
  mp3: getFeedItemMp3(item),
  image: getFeedItemImage(item),
});

const buildAudioPlayer = (mp3) =>
  [
    `<audio controls src=${mp3}>`,
    `<a href="${mp3}">Download episode</a>`,
    `</audio>`,
  ].join("");

const buildFeedItem = (item) => {
  const { id, title, date, description, mp3, image } = getFeedItemData(item);
  const player = buildAudioPlayer(mp3);

  const feedItemContent = [
    `<img src="${image}" alt="" />`,
    // `<div class="player">${player}</div>`,
    `<h2><a href="#${id}">${title}</a></h2>`,
    `<p class="date"><strong>${date}</strong></p>`,
    `<p class="description">${description}</p>`,
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
