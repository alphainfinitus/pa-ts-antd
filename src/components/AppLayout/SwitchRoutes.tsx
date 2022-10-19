// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Discussions from 'src/screens/Discussions';
import Home from 'src/screens/Home';

const SwitchRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/discussions' element={<Discussions />} />
		</Routes>
	);
};

export default SwitchRoutes;