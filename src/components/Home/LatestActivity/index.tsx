// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { Tabs } from 'antd';
import React from 'react';

import AllPostsTable from './AllPostsTable';

const LatestActivity = () => {
	const tabItems = [
		{ label: 'All', key: 'all', children: <AllPostsTable /> },
		{ label: 'Discussions', key: 'discussions', children: 'Content 2' },
		{ label: 'Proposals', key: 'proposals', children: 'Content 3' },
		{ label: 'Referenda', key: 'referenda', children: 'Content 3' },
		{ label: 'Motions', key: 'motions', children: 'Content 3' },
		{ label: 'Treasury Proposals', key: 'treasury-proposals', children: 'Content 3' },
		{ label: 'Bounties', key: 'bounties', children: 'Content 3' },
		{ label: 'Tips', key: 'tips', children: 'Content 3' }
	];

	return (
		<div className='bg-white drop-shadow-md p-6 rounded-md h-[650px]'>
			<h2 className='dashboard-heading mb-6'>Latest Activity</h2>
			<Tabs
				type="card"
				items={tabItems}
			/>
		</div>
	);
};

export default LatestActivity;