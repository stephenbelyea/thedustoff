const feedContainer = document.getElementById("feed");

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

const buildMetaItem = (icon, alt, meta) =>
  [
    `<span class="meta-item">`,
    `<img src="./icons/${icon}.svg" alt="${alt}" />`,
    `<span>${meta}</span>`,
    `</span>`,
  ].join("");

const buildAudioPlayer = (mp3) => {
  if (mp3 === "")
    return `<p class="meta unavailable">${buildMetaItem(
      "headset",
      "",
      "Episode currently unavailable"
    )}</p>`;
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
    buildMetaItem("calendar", "Release date", date),
    buildMetaItem("timer", "Episode duration", duration),
    mp3
      ? buildMetaItem(
          "download",
          "Download file",
          `<a href="${mp3}">Download</a>`
        )
      : "",
    `</p>`,
    `<p class="description">${description}</p>`,
    `</div>`,
  ];

  const feedItem = document.createElement("article");
  feedItem.innerHTML = feedItemContent.join("");
  feedItem.setAttribute("id", id);

  return feedItem;
};

const buildFeedList = async () => {
  const feed = await getParsedFeed();
  const items = feed.getElementsByTagName("item");

  for (let i = 0; i < items.length; i++) {
    const feedItem = buildFeedItem(items[i]);
    feedContainer.appendChild(feedItem);
  }
};

buildFeedList();
