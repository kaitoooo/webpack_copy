// ディレクトリパスを取得する
const path = require('path');
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');
// CSSを別ファイルに生成する
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// ビルドする際にコピーする
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // 'development' | 'production'
  mode: process.env.NODE_ENV,
  // エントリーポイントの設定
  context: src,
  entry: {
    main: './js/main.js',
  },
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'js/[name].bundle.js',
    // 出力先のパス
    path: dist,
  },
  // ローカルサーバの指定
  devServer: {
    hot: true,
    open: true,
    contentBase: src,
    watchContentBase: true,
    port: 3000,
  },
  // モジュールの解決方法を指定
  resolve: {
    modules: [src, 'node_modules'],
    extensions: ['.js'],
  },
  module: {
    // babel-loaderの設定
    rules: [
      {
        test: /\.js$/,
        use: [
          {
              loader: 'babel-loader',
              options: {
                  presets: [
                      [
                          '@babel/preset-env',
                          {
                              useBuiltIns: 'usage',
                              corejs: 3,
                          },
                      ],
                  ],
              },
          },
      ],
        exclude: /node_modules/,
        // swiper使用時
        // exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
      },
      // SCSSをJSファイルと別々に生成する
      {
        test: /\.(sc|c|sa)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      // CSSでbackground-imageを使う
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/common/',
              publicPath: function (path) {
                return '../img/common/' + path;
              },
            },
          },
        ],
      },
    ],
  },
  //vue.jsの設定
  // resolve: {
  //   alias: {
  //     vue$: 'vue/dist/vue.esm.js',
  //   },
  // },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
          {
              from: path.resolve(src, 'img'),
              to: path.resolve(dist, 'img'),
              toType: 'dir',
              globOptions: {
                  ignore: ['*.DS_Store', '**/.gitkeep'],
              },
          },
          {
              from: path.resolve(src, 'pages'),
              to: dist,
              toType: 'dir',
              globOptions: {
                  ignore: ['*.DS_Store', '**/.gitkeep'],
              },
          },
      ],
  }),
  ],
};
