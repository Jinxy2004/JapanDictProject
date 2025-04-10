// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [
    ...config.resolver.assetExts,
    'gz',
    'dat',
    // Add any other custom extensions
];

module.exports = config;