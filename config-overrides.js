// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable no-tabs */
/* eslint-disable sort-keys */

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function override(webpackConfig) {
	webpackConfig.module.rules.push({
		test: /\.mjs$/,
		include: /node_modules/,
		type: 'javascript/auto'
	});

	webpackConfig.module.rules[1].oneOf.splice(2, 0, {
		test: /\.less$/i,
		exclude: /\.module\.(less)$/,
		use: [
			{ loader: 'style-loader' },
			{ loader: 'css-loader' },
			{
				loader: 'less-loader',
				options: {
					lessOptions: {
						javascriptEnabled: true
					}
				}
			}
		]
	});

	webpackConfig.plugins.push(
		new NodePolyfillPlugin({
			excludeAliases: ['console']
		})
	);

	return webpackConfig;
};