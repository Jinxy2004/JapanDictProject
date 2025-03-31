const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [
    ...config.resolver.assetExts, // Keep default extensions (png, jpg, etc.)
    'traineddata', // For Tesseract language files (jpn.traineddata)
];

module.exports = config;