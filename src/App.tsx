// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ThemeProvider } from '@xstyled/styled-components';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Apollo from './components/Apollo';
import AppLayout from './components/AppLayout';
import Modal from './components/Modal';
import { ApiContextProvider } from './context/ApiContext';
import { MetaProvider } from './context/MetaContext';
import { ModalProvider } from './context/ModalContext';
import { UserDetailsProvider } from './context/UserDetailsContext';
import { theme } from './themes/theme';
import { GlobalStyle } from './ui-components/GlobalStyle';

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<ModalProvider>
					<UserDetailsProvider>
						<MetaProvider>
							<Apollo>
								<GlobalStyle />
								<Modal/>
								<ApiContextProvider>
									<AppLayout />
								</ApiContextProvider>
							</Apollo>
						</MetaProvider>
					</UserDetailsProvider>
				</ModalProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;

