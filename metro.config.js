const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push(
  // Fonts
  'ttf',
  'otf',
  'woff',
  'woff2',
  // Images
  'webp',
  'svg'
);

// Add support for source maps
config.resolver.sourceExts.push('tsx', 'ts', 'jsx', 'js');

module.exports = config;





