import 'bootstrap';
import { object, string, setLocale } from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import watch from './watchers.js';

export default () => {

    // создание экземпляра i18next
    const i18n = i18next.createInstance();
    i18n.init({
        lng: 'ru',
        debug: true,
        resources: {
            ru: {
                translation: {
                    errors: {
                        required: 'Не должно быть пустым',
                        notUrl: 'Ссылка должна быть валидным URL',
                    },
                }
            }
        }
    }).then(() => {
        setLocale({
            string: {
                url: () => ({ key: 'notUrl' }),
            },
            mixed: {
                required: () => ({ key: 'required' }),
            },
        });


        const state = {
            form: {
                state: 'valid',
                data: {
                    url: '',
                },
                error: null,
            },
        };

        const elements = {
            from: document.querySelector('.rss-form'),
            textDanger: document.querySelector('.text-danger'),
            url: document.querySelector('[aria-label="url"]'),
            add: document.querySelector('[aria-label="add"]'),
        }

        let userSchema = object({
            url: string().url().required(),
        });

        const watchedState = watch(elements, state, i18n);

        elements.add.addEventListener('click', function (e) {
            e.preventDefault();
            userSchema.validate({url: elements.url.value},{ abortEarly: false })
                .then(() => null)
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
