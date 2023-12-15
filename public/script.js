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

const getFeedItemData = (item) => ({
  id: getFeedItemId(item),
  title: getTagText(item, "title"),
  date: getFeedItemDateText(item),
  description: getTagText(item, "description"),
});

const buildFeedItem = (item) => {
  const { id, title, date, description } = getFeedItemData(item);

  const feedItemContent = [
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
  summary.textContent = `${items.length} episodes in total.`;
  summary.setAttribute("id", "summary");
  return summary;
};

const buildFeedList = async () => {
  const feed = await getParsedFeed();
  const items = feed.getElementsByTagName("item");

  const feedSummary = buildFeedSummary(items);
  feedContainer.appendChild(feedSummary);

  for (let i = 0; i < items.length; i++) {
    const feedItem = buildFeedItem(items[i]);
    feedContainer.appendChild(feedItem);
  }
};

buildFeedList();
