const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Treat all CSS files as assets instead of source files
config.resolver.assetExts.push('css');
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== 'css');

// Make sure CSS modules pattern never matches
config.transformer.cssModulePattern = /\.never-match-anything-ever$/;

// Ensure proper platform resolution for web
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

module.exports = config;