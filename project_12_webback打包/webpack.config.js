const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function getPages() {
  const pages = {};
  glob.sync('./src/pages/*/index.js').forEach((filePath) => {
    const t = filePath.match(/\/pages\/(.+)\/index.js/);
    const name = t[1];
    pages[name] = {}
    pages[name]['entry'] = filePath;
  });
  glob.sync('./src/pages/*/index.html').forEach((filePath) => {
    const t = filePath.match(/\/pages\/(.+)\/index.html/);
    const name = t[1];
    if (name in pages) {
      pages[name]['html'] = filePath;
    }
  });
  return pages
}

module.exports = (env = {}) => {
  const isProduction = env.production === true;
  const pages = getPages();

  return {
    mode: isProduction ? 'production' : 'development',
    entry: (() => {
      const entrys = {
        app: './src/index.js'
      };
      for(key in pages) {
        entrys[key] = pages[key]['entry']
      }
      return entrys
    })(),
    output: {
      filename: 'js/[name].[hash].js',
      path: path.resolve(__dirname, 'dist')
    },
    devtool: (() => {
      if (isProduction) return 'source-map'
      else return 'cheap-module-eval-source-map'
    })(),
    devServer: (() => {
      if (isProduction) return {}
      else return {
        contentBase: './dist',
        hot: true // 模块热替换(Hot Module Replacement 或 HMR)
      }
    })(),
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
        },
        {
          test: /\.s(a|c)ss$/,
          use: [
            "style-loader", // 将 JS 字符串生成为 style 节点
            "css-loader", // 将 CSS 转化成 CommonJS 模块
            "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ['file-loader']
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },
    plugins: (() => {
      const plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          title: 'Hi Web',
          filename: 'index.html',
          template: 'src/index.html',
        }),
      ];
      for (key in pages) {
        plugins.push(new HtmlWebpackPlugin({
          filename: `${key}.html`,
          template: pages[key]['html'],
          chunks: [key]
        }));
      }
      if (isProduction) return plugins;
      else return plugins.concat([
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
      ]);
    })(),
    optimization: (() => {
      const optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all'
            }
          }
        },
        runtimeChunk: { name: 'manifest' } // 运行时代码
      };
      if (isProduction) return Object.assign(optimization, {
        minimize: true,
        minimizer: [new TerserPlugin()],
        moduleIds: 'hashed',
        runtimeChunk: 'single',
      });
      else return optimization;
    })()
  };
};
