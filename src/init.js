import 'bootstrap';
import { object, string } from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import watch from './watchers.js';

export default () => {
    const from = document.querySelector('.rss-form');
    const textDanger = document.querySelector('.text-danger');
    const url = document.querySelector('[aria-label="url"]');
    const add = document.querySelector('[aria-label="add"]');
    console.log(textDanger);

    let userSchema = object({
        url: string().url(),
    });

    add.addEventListener('click', function (e){
        e.preventDefault();
        const urlValidate = userSchema.validateSync({url: url.value},{ abortEarly: false });
        console.log(urlValidate);
    });



};
