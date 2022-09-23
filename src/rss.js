export default (content) => {
    const xmlDom =  new DOMParser().parseFromString(content, 'text/xml');
    const titleEl = xmlDom.querySelector('channel > title');
    const title = titleEl.textContent;
    const descriptionEl = xmlDom.querySelector('channel > description');
    const description = descriptionEl.textContent;
    const elementFeeds = xmlDom.querySelectorAll('item');
    const feeds = Array.from(elementFeeds).map((feed) => {
        const titleEl = feed.querySelector('title');
        const title = titleEl.textContent;
        const descriptionEl = feed.querySelector('description');
        const description = descriptionEl.textContent;
        const linkEl = feed.querySelector('link');
        const link = linkEl.textContent;
        return {title, description, link};
    });
    return { title: title, description: description, feeds: feeds };
}

