// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import AboutNetwork from 'src/components/Home/AboutNetwork';
import TreasuryOverview from 'src/components/Home/TreasuryOverview';

const Home = () => {
	return (
		<>
			<h1 className='dashboard-heading'>Overview</h1>

			<div className="mt-6 mx-1">
				<AboutNetwork />
			</div>

			<div className="mt-8 mx-1">
				<TreasuryOverview />
			</div>
		</>
	);
};

export default Home;