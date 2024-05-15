module.exports = {
  root: true,
  extends: [
    'eslint:recommended', // Added to integrate eslitn into application
    '@react-native',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', {endOfLine: 'auto'}],
  },
};
