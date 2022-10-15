// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import '../app.less';
import '../themes/tailwindSetup.css';

import { createGlobalStyle } from '@xstyled/styled-components';

export const GlobalStyle = createGlobalStyle`
		html {
				font-size: 62.5%;
		}

		body {
				margin: 0;
				font-family: font_default, 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
						'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
						sans-serif;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
				background-color: grey_app_background;
				color: black_text;
		}

		pre {
				display: inline-block;
				max-width: 100%;
				white-space: pre-wrap;
				background-color: grey_light;
		}

		code {
				display: inline-block;
				max-width: 100%;
				font-family: font_mono, source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
				monospace;
				background-color: grey_light;
				color: black_primary;
				font-size: sm;
		}

		ul {
				padding: 0;
		}

		p {
				a {
						color: pink_primary;
						&:hover {
								color: pink_secondary;
						}
				}
		}

		a:hover {
				text-decoration: none;
		}
		
		h1, h2, h3, h4, h5, h6 {
				color: black_primary;
				font-family: font_default;
				line-height: 100%;
		}

		::selection {
				background-color: black_primary;
				color: white;
		}
`;
