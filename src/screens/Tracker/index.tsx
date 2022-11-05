// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col,Row } from 'antd';
import React from 'react';

import BountyContainer from './Bounties';
import MotionContainer from './Motion';
import ProposalContainer from './Proposals';
import ReferendaContainer from './Referenda';
import TechCommitteeProposalsContainer from './TechCommitteeProposals';
import TipContainer from './Tips';
import TreasuryContainer from './Treasury';

const TrackerContainer = ({ className } : {className?: string}) => {

	return (
		<div className={className}>
			<h1 className='dashboard-heading mb-4 md:mb-6'>Personal Tracker</h1>

			{/* Intro and Create Post Button */}
			<div className="flex flex-col md:flex-row">
				<p className="text-sidebarBlue text-sm md:text-base font-medium bg-white p-4 md:p-8 rounded-md w-full shadow-md mb-4">
				This is a place to keep track of on chain posts.
				</p>
			</div>
			<Row gutter={[0, 16]}>
				<Col span={24}>

					<ReferendaContainer className='referendaContainer' />
				</Col>
				<Col span={24}>

					<ProposalContainer className='proposalContainer' />
				</Col>
				<Col span={24}>

					<MotionContainer className='motionContainer' />
				</Col>
				<Col span={24}>

					<TreasuryContainer className='treasuryContainer' />
				</Col>
				<Col span={24}>

					<TechCommitteeProposalsContainer className='techCommitteeProposalsContainer' />
				</Col>
				<Col span={24}>

					<TipContainer className='tipContainer' />
				</Col>
				<Col  span={24}>

					<BountyContainer className='bountyContainer' />
				</Col>
			</Row>
		</div>
	);

};

export default TrackerContainer;
