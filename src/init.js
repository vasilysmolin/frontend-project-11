import 'bootstrap';
import { object, string } from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import watch from './watchers.js';

export default () => {

    // создание экземпляра i18next
    // const i18nextInstance = i18next.createInstance();
    // i18nextInstance.init({
    //     lng: 'ru',
    //     body: {
    //       'h1': 'RSS агрегатор',
    //     },
    //     form: {
    //         'url': ''
    //     },
    // });

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
        url: string().url(),
    });

    const watchedState = watch(elements, state);

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



};
