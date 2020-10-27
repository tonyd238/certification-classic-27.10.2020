// -----------------------------------------------------------------------------
// Deps
// -----------------------------------------------------------------------------

const paths = require('./config/paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// -----------------------------------------------------------------------------
// Configuration for IDE/Editor
// -----------------------------------------------------------------------------

module.exports = {
	stats: 'minimal',
	resolve: {
		alias: {
			'js#': paths.src.js,
			'sass#': paths.src.sass
		},
		modules: paths.modules
	},
	entry: paths.src.js + '/index.js',
	output: {
		path: paths.build.content,
		publicPath: paths.build.publicPath,
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ['babel-loader']
			},
			{
				test: /\.(scss|css)$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: { sourceMap: true, importLoaders: 1 }
					},
					{ loader: 'postcss-loader', options: { sourceMap: true } },
					{ loader: 'sass-loader', options: { sourceMap: true } }
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Certification (Classic) 27.10.2020',
			template: paths.src.tpl + '/index.html',
			filename: 'index.html'
		})
	]
};
