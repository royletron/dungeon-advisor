module.exports = {
  entry: {
    app: ["./src/classes.js", "./src/statics.js", "./src/index.js"]
  },
  output: {
    path: "./build",
    filename: "bundle.js"
  }
};
