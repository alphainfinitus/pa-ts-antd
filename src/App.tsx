// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ThemeProvider } from '@xstyled/styled-components';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Apollo from './components/Apollo';
import { MetaProvider } from './context/MetaContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserDetailsProvider } from './context/UserDetailsContext';
import { theme } from './themes/theme';

function App({ className } : { className?:string }) {
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<NotificationProvider>
					<UserDetailsProvider>
						<MetaProvider>
							<Apollo>
								<div className={className}>
									Hello World
								</div>
							</Apollo>
						</MetaProvider>
					</UserDetailsProvider>
				</NotificationProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;

