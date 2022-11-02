// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import MembersContainer from 'src/components/Listing/Members/MembersContainer';

const Members = () => {
	return (
		<>
			<h1 className='dashboard-heading mb-4 md:mb-6'>Council</h1>

			{/* Intro and Create Post Button */}
			<div className="flex flex-col md:flex-row">
				<p className="text-sidebarBlue text-sm md:text-base font-medium bg-white p-4 md:p-8 rounded-md w-full shadow-md mb-4">
                Council is the body of elected members that consists of several on-chain accounts. The Council can act as a representative for &quot;passive&quot; (non-voting) stakeholders. Council members have two main tasks: proposing referenda for the overall stakeholder group to vote on and cancelling malicious referenda.
				</p>
			</div>
			<MembersContainer className='mt-8' />
		</>
	);
};

export default Members;