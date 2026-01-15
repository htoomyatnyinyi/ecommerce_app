// const { getDefaultConfig } = require("expo/metro-config");
// const { withUniwindConfig } = require("uniwind/metro");

// const config = getDefaultConfig(__dirname);

// module.exports = withUniwindConfig(config, {
//   input: "./global.css",
// });

const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

// your metro modifications

module.exports = withUniwindConfig(config, {
  // relative path to your global.css file (from previous step)
  cssEntryFile: "./global.css",
  // (optional) path where we gonna auto-generate typings
  // defaults to project's root

  dtsFile: "./uniwind-types.d.ts",
  // dtsFile: "./uniwind-types.d.ts",

  // theme
  extraThemes: ["ocean", "sunset", "forest", "high-contrast"],
});
