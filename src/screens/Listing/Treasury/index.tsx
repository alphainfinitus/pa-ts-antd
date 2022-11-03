// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Col,Row } from 'antd';
import React from 'react';
import TreasuryProposalFormButton from 'src/components/CreateTreasuryProposal/TreasuryProposalFormButton';
import TreasuryOverview from 'src/components/Home/TreasuryOverview';
import TreasuryContainer from 'src/components/Listing/Treasury/TreasuryContainer';

const Treasury = () => {
	return (
		<>
			<h1 className='dashboard-heading mb-4 md:mb-6'>On Chain Treasury Proposals</h1>

			{/* Treasury Overview Cards */}
			<TreasuryOverview inTreasuryProposals={true}/>

			{/* Intro and Create Post Button */}
			<Row gutter={[ { md:8 }, 8]} className="mt-8">
				<Col span={24} md={{ span:16 }}>
					<p className="text-sidebarBlue h-full text-sm md:text-base font-medium bg-white p-4 md:p-8 rounded-md w-full shadow-md mb-4">
					This is the place to discuss on-chain treasury proposals. On-chain posts are automatically generated as soon as they are created on the chain.
					Only the proposer is able to edit them.
					</p>
				</Col>
				<Col span={24} md={{ span:8 }}>
					<TreasuryProposalFormButton  />
				</Col>
			</Row>
			<TreasuryContainer className='mt-8' />
		</>
	);
};

export default Treasury;