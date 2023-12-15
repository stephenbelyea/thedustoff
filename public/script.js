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

const getFeedItemId = (item) => {
  const linkParts = item
    .querySelector("link")
    .textContent.split("/")
    .filter((part) => part !== "");
  return linkParts[linkParts.length - 1];
};

const getFeedItemData = (item) => {
  const feedItemData = {
    id: getFeedItemId(item),
    title: item.querySelector("title").textContent,
  };
  return feedItemData;
};

const buildFeedItem = (item) => {
  const { id, title } = getFeedItemData(item);

  const feedItemContent = [`<h2><a href="#${id}">${title}</a></h2>`];

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
