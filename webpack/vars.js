const path = require('path');

const root = path.join(__dirname, '..');
const paths = {
  root: path.join(__dirname, '..'),
  entry: path.join(root, 'src', 'index.tsx'),
  output: path.join(root, 'dist'),
};
const envObject = {
  DEBUG: process.env.NODE_ENV !== 'production',
  PRODUCTION: process.env.PRODUCTION === 'true',
};

module.exports = {
  paths,
  envObject,
};
