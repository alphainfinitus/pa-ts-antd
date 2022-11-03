// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import TipListing from 'src/components/Listing/Tips/TipListing';
import { useTrackerTipPostsLazyQuery } from 'src/generated/graphql';
import { post_type } from 'src/global/post_types';
import { ErrorState } from 'src/ui-components/UIStates';

const TipContainer = ({ className } : { className?:string }) => {

	let trackMap: any = {};

	try {
		trackMap = JSON.parse(global.window.localStorage.getItem('trackMap') || '{}');
	} catch (error) {
		console.error(error);
	}

	const onchainTipIds = Object.keys(trackMap.tipProposal || {}).map(key => `${key}`);

	const [refetch, { data, error, loading }] = useTrackerTipPostsLazyQuery({ variables: {
		onchainTipIds,
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
				<h1 className='dashboard-heading'>Tip Proposals</h1>
			</div>

			<TipListing loading={loading} data={data} />
		</div>
	);
};

export default TipContainer;