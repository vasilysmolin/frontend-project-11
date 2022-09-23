import 'bootstrap';
import { object, string, setLocale } from 'yup';
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
                data: {
                    url: '',
                },
                rss: [],
                error: null,
            },
        };
        const elements = {
            from: document.querySelector('.rss-form'),
            textDanger: document.querySelector('.text-danger'),
            url: document.querySelector('[aria-label="url"]'),
            add: document.querySelector('[aria-label="add"]'),
            posts: document.querySelector('.posts'),
            feeds: document.querySelector('.feeds'),
        }
        let userSchema = object({
            url: string().url().required(),
        });
        const watchedState = watch(elements, state, i18n);
        elements.add.addEventListener('click', function (e) {
            e.preventDefault();
            userSchema.validate({url: elements.url.value},{ abortEarly: false })
                .then((e) => {
                        const proxyUrl = proxy(e.url);
                        return axios.get(proxyUrl).then((res) => {
                            const data = parse(res.data.contents);
                            data.id = _.uniqueId();
                            data.feeds = data.feeds.map((feed) => {
                                return {...feed, channelId: data.id, id: _.uniqueId() }
                            });
                            watchedState.form = {
                                ...watchedState.form,
                                state: 'fill',
                                rss: data,
                            };
                        });
                    }
                )
                .catch((e) => {
                    watchedState.form = {
                        ...watchedState.form,
                        state: 'invalid',
                        error: e.message,
                    };
                });
        });
    });
};
