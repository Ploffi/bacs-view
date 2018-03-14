const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const output_directory = "dist";

var plugins = [
    new CleanWebpackPlugin([output_directory]),
    new HtmlWebpackPlugin({
        title: 'The Bacs',
        template: 'index.template.ejs'
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.js',
    }),
];

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        vendor: ['react', 'react-dom', 'material-ui'],
        app: ["./src/index.tsx"],
    },

    output: {
        filename: "bundle.js",
        path: __dirname + '/' + output_directory,
        publicPath: '/',
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", '.jsx', ".json"]
    },

    plugins: plugins,

    module: {
        rules: [

            {
                test: /\.tsx?$/,
                use: [
                    'react-hot-loader/webpack', 'babel-loader', 'awesome-typescript-loader'
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|eot|woff|woff2|gif|jpg|svg|cur)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash].[name].[ext]'
                }
            }
        ]
    },
};