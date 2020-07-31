import path from 'path';

import AssetsPlugin from 'assets-webpack-plugin';
import dotenv from 'dotenv';
import webpack from 'webpack';

dotenv.config();

const CONFIG_KEYS = [
  'ADMIN_CONTRACT',
  'API_ENDPOINT',
  'BASE_PATH',
  'ETHEREUM_NODE_ENDPOINT_WS',
  'GRAPH_NODE_ENDPOINT',
  'NODE_ENV',
  'SUBGRAPH_NAME',
  'PAYER_ADDRESS',
];

const CONFIG_KEYS_OPTIONAL = [];

const NODE_MODULES = 'node_modules';
const PATH_DIST = './build/static';
const PATH_SRC = './src/client';

function getPath(filePath) {
  return path.resolve(__dirname, filePath);
}

const config = CONFIG_KEYS.reduce((acc, key) => {
  // Check for missing config variables
  if (!process.env[key]) {
    throw new Error(`${key} not set for ${process.env.NODE_ENV}!`);
  }

  // Pass values over to app from given environment
  acc[key] = JSON.stringify(process.env[key]);

  return acc;
}, {});

CONFIG_KEYS_OPTIONAL.forEach((key) => {
  if (process.env[key]) {
    config[key] = JSON.stringify(process.env[key]);
  }
});

config.RELEASE_VERSION = `"${require('./package.json').version}"`;

export default () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const filename = isDevelopment ? '[name]' : '[name]-[contenthash:4]';
  const exclude = new RegExp(NODE_MODULES);

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
      app: getPath(`${PATH_SRC}/index.js`),
    },
    output: {
      filename: `${filename}.js`,
      sourceMapFilename: `${filename}.js.map`,
      path: getPath(PATH_DIST),
      publicPath: '/',
    },
    resolve: {
      modules: [NODE_MODULES],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude,
          use: [
            'babel-loader',
            'eslint-loader',
            'stylelint-custom-processor-loader',
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jp(e?)g|gif|glb|woff(2?)|svg|ttf|eot)$/,
          exclude,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `${filename}.[ext]`,
                publicPath: '/static/',
              },
            },
          ],
        },
      ],
    },
    devtool: 'source-map',
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: new RegExp(NODE_MODULES),
            chunks: 'all',
            name: 'lib',
          },
        },
      },
    },
    plugins: [
      new AssetsPlugin({
        path: getPath('build'),
      }),
      new webpack.DefinePlugin({
        'process.env': config,
      }),
    ],
  };
};
