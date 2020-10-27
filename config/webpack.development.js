// -----------------------------------------------------------------------------
// Deps
// -----------------------------------------------------------------------------

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const paths = require('./paths');
const baseConfig = require('../webpack.config');

// -----------------------------------------------------------------------------
// Full config
// -----------------------------------------------------------------------------

module.exports = merge(baseConfig, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		historyApiFallback: true,
		contentBase: paths.build.content,
		watchContentBase: true,
		open: true,
		compress: true,
		hot: true,
		port: 8080
	},

	plugins: [new webpack.HotModuleReplacementPlugin()]
});
