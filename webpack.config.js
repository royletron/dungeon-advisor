module.exports = {
  entry: {
    app: ["webpack/hot/dev-server", "./src/classes.js", "./src/statics.js", "./src/ui.js", "./src/index.js"]
  },
  output: {
    path: "./build",
    filename: "bundle.js"
  }
};
