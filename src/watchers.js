import onChange from 'on-change';

export default (elements, state, i18n) => onChange(state, (path, value) => {
  if (path === 'form') {
    if (state.form.state === 'invalid') {
      elements.textDanger.textContent = i18n.t([`errors.${value.error}`]);
    }
    if (state.form.state === 'fill') {
      const { feeds, posts } = state;
      const divElFeeds = document.createElement('div');
      divElFeeds.classList.add('card', 'border-0');
      divElFeeds.innerHTML = '<div class=\'card-body\'></div>';
      const feedTitle = document.createElement('h2');
      feedTitle.classList.add('card-title', 'h4');
      feedTitle.textContent = i18n.t('feeds');
      divElFeeds.querySelector('.card-body').appendChild(feedTitle);
      elements.feeds.innerHTML = '';
      elements.feeds.append(divElFeeds);
      const ulFeedsEl = document.createElement('ul');
      ulFeedsEl.classList.add('list-group', 'border-0', 'rounded-0');
      const feedsEl = feeds.map((feed) => {
        const liFeedEl = document.createElement('li');
        liFeedEl.classList.add('list-group-item', 'border-0', 'border-end-0');
        const title = document.createElement('h3');
        title.classList.add('h6', 'm-0');
        title.textContent = feed.title;
        const description = document.createElement('p');
        description.classList.add('m-0', 'small', 'text-black-50');
        description.textContent = feed.description;
        liFeedEl.append(title, description);
        return liFeedEl;
      });
      ulFeedsEl.append(...feedsEl);
      elements.feeds.append(ulFeedsEl);

      const divElPosts = document.createElement('div');
      divElPosts.classList.add('card', 'border-0');
      divElPosts.innerHTML = '<div class=\'card-body\'></div>';
      const postTitle = document.createElement('h2');
      postTitle.classList.add('card-title', 'h4');
      postTitle.textContent = i18n.t('posts');
      divElPosts.querySelector('.card-body').appendChild(postTitle);
      elements.posts.innerHTML = '';
      elements.posts.append(divElPosts);

      const ulPostsEl = document.createElement('ul');
      ulPostsEl.classList.add('list-group', 'border-0', 'rounded-0');
      const postsEl = posts.map((post) => {
        const liPostEl = document.createElement('li');
        const buttonElement = document.createElement('button');
        buttonElement.classList.add('btn', 'btn-primary');
        buttonElement.setAttribute('type', 'button');
        buttonElement.dataset.bsToggle = 'modal';
        buttonElement.dataset.bsTarget = '#exampleModal';
        buttonElement.dataset.id = post.id;
        buttonElement.textContent = i18n.t('button');
        liPostEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
        const link = document.createElement('a');
        link.setAttribute('href', post.link);
        const uiPostId = state.postsId.find((postId) => postId === post.id);
        !_.isEmpty(uiPostId) ? link.classList.add('fw-normal') : link.classList.add('fw-bold');
        link.textContent = post.title;
        link.dataset.postId = post.id;
        link.dataset.id = post.id;
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        liPostEl.appendChild(link);
        liPostEl.append(buttonElement);
        return liPostEl;
      });
      ulPostsEl.append(...postsEl);
      elements.posts.append(ulPostsEl);
    }
  }
  if (path === 'modalId') {
    const post = state.posts.find((post) => post.id === state.modalId);
    const titleEl = document.querySelector('.modal-title');
    const bodyEl = document.querySelector('.modal-body');
    const hrefEl = document.querySelector('.full-article');

    titleEl.textContent = post.title;
    bodyEl.textContent = post.description;
    hrefEl.setAttribute('href', post.link);
    hrefEl.setAttribute('target', '_blank');
    hrefEl.setAttribute('rel', 'noopener noreferrer');
  }
  if (path === 'postsId') {
      value.forEach((postId) => {
        const postEl = document.querySelector(`[data-post-id="${postId}"]`);
        postEl.classList.add('fw-normal');
        postEl.classList.remove('fw-bold');
      });
  }
});
