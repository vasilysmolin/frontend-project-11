import onChange from 'on-change';

export default (elements, state, i18n) => {
    return onChange(state, (path, value) => {
        if (path === 'form') {
            if (state.form.state === 'invalid') {
                elements.textDanger.textContent = i18n.t([`errors.${value.error.key}`]);
            }
        }
    });
};

