// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ThemeProvider } from '@xstyled/styled-components';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { theme } from './themes/theme';

function App({ className } : { className?:string }) {
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<div className={className}>
          Hello World
				</div>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;

