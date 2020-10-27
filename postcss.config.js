module.exports = {
	plugins: {
		'postcss-sort-media-queries': {
			sort: 'mobile-first'
		},
		'postcss-preset-env': {
			autoprefixer: {
				flexbox: 'no-2009'
			},
			stage: 3,
			features: {
				'custom-properties': false
			}
		}
	}
};
