// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import TreasuryListing from 'src/components/Listing/Treasury/TreasuryListing';
import { useTrackerDemocracyTreasuryProposalPostsLazyQuery } from 'src/generated/graphql';
import { post_type } from 'src/global/post_types';
import { ErrorState } from 'src/ui-components/UIStates';

const TreasuryProposalsContainer = ({ className } : { className?:string }) => {

	let trackMap: any = {};

	try {
		trackMap = JSON.parse(global.window.localStorage.getItem('trackMap') || '{}');
	} catch (error) {
		console.error(error);
	}

	const onchainTreasuryProposalIds = Object.keys(trackMap.treasuryProposal || {}).map(key => Number(key));

	const [refetch, { data, error, loading }] = useTrackerDemocracyTreasuryProposalPostsLazyQuery({ variables: {
		onchainTreasuryProposalIds,
		postType: post_type.ON_CHAIN
	} });

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (error?.message) {
		return <ErrorState errorMessage={error.message} />;
	}

	return (
		<div className={`${className} shadow-md bg-white p-3 md:p-8 rounded-md`}>
			<div className='flex items-center justify-between'>
				<h1 className='dashboard-heading'>Treasury Proposals</h1>
			</div>

			<TreasuryListing loading={loading} data={data} />
		</div>
	);
};

export default TreasuryProposalsContainer;