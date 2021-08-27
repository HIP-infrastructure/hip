const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const glob = require("glob");

const assetsPath = path.join(__dirname, './dist');

module.exports = {
  mode: "production",
  entry: {
    "bundle.js": glob
      .sync("build/static/?(js|css)/*.?(js|css)")
      .map((f) => path.resolve(__dirname, f)),
  },
  output: {
    path: assetsPath,
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/',
},
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg|woff|ttf|eot)$/,
        loader: 'url-loader',
        options: { limit: 10240 },
    },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new UglifyJsPlugin()],
};
