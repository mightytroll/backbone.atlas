let path = require("path");
let CleanWebpackPlugin = require('clean-webpack-plugin');

const application = require('./package.json');

module.exports = {
    mode: "development",

    context: path.resolve(__dirname, "src"),
    entry: './index.js',

    module: {
        rules: [{
            test: /\.js$/,
            include: /src/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ['env']
                }
            }
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `${application.name}.js`,
        library: "Atlas",
        libraryTarget: 'umd',
        publicPath: '/dist/',
        umdNamedDefine: true
    },
    externals: {
        "backbone": {
            commonjs: "backbone",
            commonjs2: "backbone",
            amd: "backbone",
            root: "Backbone"
        },
        "underscore": {
            commonjs: "underscore",
            commonjs2: "underscore",
            amd: "underscore",
            root: "_"
        }
    }
};