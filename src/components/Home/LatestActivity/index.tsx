// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import styled from '@xstyled/styled-components';
import { Tabs } from 'antd';
import React from 'react';

import AllPostsTable from './AllPostsTable';
import BountyPostsTable from './BountyPostsTable';
import DiscussionPostsTable from './DiscussionPostsTable';
import MotionPostsTable from './MotionPostsTable';
import ProposalPostsTable from './ProposalPostsTable';
import ReferendaPostsTable from './ReferendaPostsTable';
import TipPostsTable from './TipPostsTable';
import TreasuryPostsTable from './TreasuryPostsTable';

const LatestActivity = ({ className }: {className?:string}) => {
	const tabItems = [
		{ label: 'All', key: 'all', children: <AllPostsTable /> },
		{ label: 'Discussions', key: 'discussions', children: <DiscussionPostsTable /> },
		{ label: 'Proposals', key: 'proposals', children: <ProposalPostsTable /> },
		{ label: 'Referenda', key: 'referenda', children: <ReferendaPostsTable /> },
		{ label: 'Motions', key: 'motions', children: <MotionPostsTable /> },
		{ label: 'Treasury Proposals', key: 'treasury-proposals', children: <TreasuryPostsTable /> },
		{ label: 'Bounties', key: 'bounties', children: <BountyPostsTable /> },
		{ label: 'Tips', key: 'tips', children: <TipPostsTable /> }
	];

	return (
		<div className={`${className} bg-white drop-shadow-md p-6 rounded-md h-[650px]`}>
			<h2 className='dashboard-heading mb-6'>Latest Activity</h2>
			<Tabs
				type="card"
				items={tabItems}
			/>
		</div>
	);
};

export default styled(LatestActivity)`
	th {
		color: nav_link !important;
	}

	td.ant-table-cell {
		color: nav_blue !important;
	}

	tr:nth-child(2n) td {
    background-color: #fbfbfb !important;
	}

	tr {
		cursor: pointer !important;
	}
`;