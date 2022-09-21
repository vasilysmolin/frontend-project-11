import onChange from 'on-change';

export default (elements, state) => {
    const watchState = onChange(state, (path, value) => {
        if (path === 'form') {
            if (state.form.state === 'invalid') {
                elements.textDanger.textContent = value.error;
            }
        }
    });
    return watchState;
};

