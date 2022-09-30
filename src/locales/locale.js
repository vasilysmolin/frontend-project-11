export default {
  string: {
    url: () => ({ key: 'isNotValidUrl' }),
  },
  mixed: {
    required: () => ({ key: 'required' }),
    notOneOf: () => ({ key: 'isExists' }),
  },
};
