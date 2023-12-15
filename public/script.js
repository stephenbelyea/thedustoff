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

const getFeedItemData = (item) => {
  const feedItemData = {
    id: getFeedItemId(item),
    title: getTagText(item, "title"),
    dateText: getFeedItemDateText(item),
  };
  return feedItemData;
};

const buildFeedItem = (item) => {
  const { id, title, dateText } = getFeedItemData(item);

  const feedItemContent = [
    `<h2><a href="#${id}">${title}</a></h2>`,
    `<p class="date">${dateText}</p>`,
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
