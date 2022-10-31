// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Col,Row } from 'antd';
import React from 'react';
import BountyContainer from 'src/components/Listing/Bounties/BountyContainer';
import MotionContainer from 'src/components/Listing/Motions/MotionsContainer';
import ProposalContainer from 'src/components/Listing/Proposals/ProposalsContainer';
import TechCommitteeProposalsContainer from 'src/components/Listing/TechCommProposals/TechCommProposalsContainer';
import TipContainer from 'src/components/Listing/Tips/TipContainer';
import TreasuryContainer from 'src/components/Listing/Treasury/TreasuryContainer';

import ReferendaContainer from './Referenda';

const TrackerContainer = ({ className } : {className?: string}) => {

	return (
		<div className={className}>
			<h1 className='dashboard-heading mb-4 md:mb-6'>Council</h1>

			{/* Intro and Create Post Button */}
			<div className="flex flex-col md:flex-row">
				<p className="text-sidebarBlue text-sm md:text-base font-medium bg-white p-4 md:p-8 rounded-md w-full shadow-md mb-4">
    Council is the body of elected members that consists of several on-chain accounts. The Council can act as a representative for &quot;passive&quot; (non-voting) stakeholders. Council members have two main tasks: proposing referenda for the overall stakeholder group to vote on and cancelling malicious referenda.
				</p>
			</div>
			<Row gutter={4}>
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
