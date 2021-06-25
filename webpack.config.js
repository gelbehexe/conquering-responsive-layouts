const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
require('dotenv-defaults/config')

const dontMinify = parseInt(process.env.DONT_MINIFY)

module.exports = (env) => {

    // noinspection JSUnresolvedVariable
    const isDev = env.development || env.WEBPACK_SERVE

    const filenameBase = isDev ? '[name]' : '[name].[contenthash]'

    // noinspection JSUnresolvedVariable
    const devOptions = isDev ? {
        mode: "development",
        devtool: "inline-source-map",
    } : {}

    const result = {
        mode: "production",
        devtool: false,
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 9000,
            hot: true,
        },
        entry: {
            index: "./src/index.js",
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Final Challenge",
                template: "./src/index.html",
                minify: dontMinify ? false : "auto",
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "./public",
                        globOptions: {
                            dot: true,
                            ignore: ["**/.gitignore"]
                        }
                    }
                ]
            }),
            new MiniCssExtractPlugin({
                filename: `css/${filenameBase}.css`,
                chunkFilename: isDev ? '[id].css' : '[id].[contenthash].css',
            }),
        ],
        output: {
            filename: `${filenameBase}.js`,
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [
                        {loader: MiniCssExtractPlugin.loader, options: {
                                // publicPath: "mypub1"
                                esModule: false,
                                publicPath: '../',

                            }},
                        "css-loader"
                    ],
                    sideEffects: true,
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: `assets/img/${filenameBase}[ext]`,
                    }
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: `assets/fonts/${filenameBase}[ext]`,
                    }
                }
            ],
        },
        optimization: {
        },
        ...devOptions,
    }

    // noinspection JSUnresolvedVariable
    if (env.WEBPACK_SERVE) {
        result.optimization.runtimeChunk = "single"

    }

    if (isDev) {
        // only enable hot in development
        // noinspection JSUnresolvedFunction
        result.plugins.push(new webpack.HotModuleReplacementPlugin());

    } else if (!dontMinify) {
        result.optimization.minimizer = [
            `...`,
            new CssMinimizerPlugin(),
        ]
    }


    return result
}
