import 'bootstrap';
import { setLocale } from 'yup';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import watch from './watchers.js';
import parse from './rss.js';
import locale from './locales/locale.js';
import lang from './locales/lang.js';

export default () => {
  const proxy = (url) => {
    const urlProxy = new URL('/get', 'https://allorigins.hexlet.app');
    urlProxy.searchParams.set('disableCache', 'true');
    urlProxy.searchParams.set('url', url);
    return urlProxy.href;
  };

  const getErrorType = (e) => {
    if (e.isParsingRssError) {
      return 'isNotValidRss';
    }
    if (e.isAxiosError) {
      return 'network';
    }
    return 'unknown';
  };

  const updateFeeds = (watchedState) => {
    const proxyPosts = watchedState.feeds.map((stateFeed) => {
      const proxyUrl = proxy(stateFeed.url);
      return axios.get(proxyUrl).then((res) => {
        const data = parse(res.data.contents);
        const newPosts = data.feeds.map((feed) => ({ ...feed, channelId: stateFeed.id }));
        const oldPosts = watchedState.posts.filter((post) => post.channelId === stateFeed.id);
        const diffPosts = _.differenceWith(
          newPosts,
          oldPosts,
          (postOne, postTwo) => postOne.link === postTwo.link,
        )
          .map((post) => ({ ...post, id: _.uniqueId() }));
        watchedState.posts.unshift(...diffPosts);
        watchedState.form = {
          ...watchedState.form,
          state: 'fill',
          error: null,
        };
      }).catch(() => {});
    });

    setTimeout(() => updateFeeds(watchedState), 5000);
    return proxyPosts;
  };

  const i18n = i18next.createInstance();
  return i18n.init({
    lng: 'ru',
    debug: true,
    resources: lang,
  }).then(() => {
    setLocale(locale);
    const urlSchema = yup.string().url().required();
    const validateUrl = (url, feeds) => {
      const urls = feeds.map((feed) => feed.url);
      const fullSchema = urlSchema.notOneOf(urls);
      return fullSchema.validate(url)
        .then(() => null)
        .catch((e) => e.message);
    };

    const state = {
      form: {
        state: 'valid',
        error: null,
      },
      loading: {
        state: 'valid',
        error: null,
      },
      modalId: null,
      postsId: [],
      feeds: [],
      posts: [],
    };
    const elements = {
      from: document.querySelector('.rss-form'),
      tips: document.querySelector('#tips'),
      url: document.querySelector('[aria-label="url"]'),
      add: document.querySelector('[aria-label="add"]'),
      posts: document.querySelector('.posts'),
      feeds: document.querySelector('.feeds'),
    };

    const watchedState = watch(elements, state, i18n);
    setTimeout(() => updateFeeds(watchedState));
    elements.add.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.loading.state = 'loading';
      return validateUrl(elements.url.value, watchedState.feeds)
        .then((error) => {
          if (!error) {
            const proxyUrl = proxy(elements.url.value);
            axios.get(proxyUrl).then((res) => {
              const data = parse(res.data.contents);
              const feed = {
                url: elements.url.value,
                id: _.uniqueId(),
                title: data.title,
                description: data.description,
              };
              const posts = data.feeds.map((feedState) => (
                {
                  ...feedState,
                  channelId: data.id,
                  id: _.uniqueId(),
                }
              ));
              watchedState.feeds.unshift(feed);
              watchedState.posts.unshift(...posts);
              watchedState.form = {
                ...watchedState.form,
                state: 'fill',
                error: null,
              };
              watchedState.loading = { ...watchedState.loading, state: 'valid' };
            }).catch((err) => {
              watchedState.loading = {
                ...watchedState.loading,
                state: 'invalid',
                error: getErrorType(err),
              };
            });
          } else {
            watchedState.loading = {
              ...watchedState.loading,
              state: 'invalid',
              error: error.key,
            };
          }
        }).catch((error) => {
          watchedState.loading = {
            ...watchedState.loading,
            state: 'invalid',
            error: getErrorType(error),
          };
        });
    });
    elements.posts.addEventListener('click', (e) => {
      const postId = e.target.dataset.id;
      if (!_.isEmpty(postId)) {
        watchedState.modalId = postId;
        watchedState.postsId.push(postId);
      }
    });
  });
};
