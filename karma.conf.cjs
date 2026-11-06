module.exports = (config) =>
  config.set({
    frameworks: ["jasmine"],
    plugins: [require("karma-jasmine"), require("karma-chrome-launcher")],
    browsers: ["ChromeHeadless"],
    singleRun: true,
    reporters: ["dots"],
    browserNoActivityTimeout: 30000,
    client: { jasmine: { random: false } },
  });
