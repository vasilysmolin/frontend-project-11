import 'bootstrap';
import { setLocale } from 'yup';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import watch from './watchers.js';
import parse from './rss.js';
import locale from './locales/locale.js';
import lang from './locales/lang.js';
import _ from 'lodash';

export default () => {

    const proxy = (url) => {
        const urlProxy = new URL('/get', 'https://allorigins.hexlet.app');
        urlProxy.searchParams.set('disableCache', 'true');
        urlProxy.searchParams.set('url', url);
        return urlProxy.href;
    }

    const urlSchema = yup.string().url().required();

    const validateUrl = (url, feeds) => {
        const urls = feeds.map((feed) => feed.url);
        const fullSchema = urlSchema.notOneOf(urls);
        return fullSchema.validate(url,{ abortEarly: false })
            .then(() => null)
            .catch((e) => e.message)
    }

    const i18n = i18next.createInstance();
    return i18n.init({
        lng: 'ru',
        debug: true,
        resources: lang
    }).then(() => {
        setLocale(locale);
        const state = {
            form: {
                state: 'valid',
                error: null,
            },
            feeds: [],
            posts: [],
        };
        const elements = {
            from: document.querySelector('.rss-form'),
            textDanger: document.querySelector('.text-danger'),
            url: document.querySelector('[aria-label="url"]'),
            add: document.querySelector('[aria-label="add"]'),
            posts: document.querySelector('.posts'),
            feeds: document.querySelector('.feeds'),
        }

        const watchedState = watch(elements, state, i18n);
        elements.add.addEventListener('click', function (e) {
            e.preventDefault();
            validateUrl(elements.url.value, watchedState.feeds)
                .then((error) => {
                    console.log(error);
                        if(!error) {
                            const proxyUrl = proxy(elements.url.value);
                            return axios.get(proxyUrl).then((res) => {
                                const data = parse(res.data.contents);
                                const feed = {
                                    url: elements.url.value, id: _.uniqueId(), title: data.title, description: data.descrpition,
                                };
                                const posts = data.feeds.map((feed) => {
                                    return {...feed, channelId: data.id, id: _.uniqueId() }
                                });
                                watchedState.feeds.unshift(feed);
                                watchedState.posts.unshift(...posts);
                                watchedState.form = {
                                    ...watchedState.form,
                                    state: 'fill',
                                    error: null,
                                };
                            });
                        } else {
                            watchedState.form = {
                                ...watchedState.form,
                                state: 'invalid',
                                error: error.key,
                            };
                        }

                    }
                )
                .catch((error) => {
                    watchedState.form = {
                        ...watchedState.form,
                        state: 'invalid',
                        error: error.key,
                    };
                });

            // userSchema.validate({url: elements.url.value},{ abortEarly: false })

        });
    });
};
