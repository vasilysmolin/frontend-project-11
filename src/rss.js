export default (content) => {
  const xmlDom = new DOMParser().parseFromString(content, 'text/xml');
  const parseError = xmlDom.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParsingRssError = true;
    throw error;
  }
  const titleEl = xmlDom.querySelector('channel > title');
  const title = titleEl.textContent;
  const descriptionEl = xmlDom.querySelector('channel > description');
  const description = descriptionEl.textContent;
  const elementFeeds = xmlDom.querySelectorAll('item');
  const feeds = Array.from(elementFeeds).map((feed) => {
    const titleElFeed = feed.querySelector('title');
    const titleFeed = titleElFeed.textContent;
    const descriptionElFeed = feed.querySelector('description');
    const descriptionFeed = descriptionElFeed.textContent;
    const linkElFeed = feed.querySelector('link');
    const link = linkElFeed.textContent;
    return { title: titleFeed, description: descriptionFeed, link };
  });
  return { title, description, feeds };
};
