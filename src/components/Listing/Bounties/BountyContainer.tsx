// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { useBountiesCountLazyQuery } from 'src/generated/graphql';
import { post_type } from 'src/global/post_types';

import BountyListingContainer from './BountyListingContainer';

const BountyContainer = ({ className } : { className?:string }) => {

	const [refetch, { data }] = useBountiesCountLazyQuery({ variables: {
		postType: post_type.ON_CHAIN
	} });
	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<div className={`${className} shadow-md bg-white p-3 md:p-8 rounded-md`}>
			<div className='flex items-center justify-between'>
				<h1 className='dashboard-heading'>{ data?.posts_aggregate.aggregate?.count } Bounties</h1>
			</div>

			<BountyListingContainer className='mt-6' count={data?.posts_aggregate.aggregate?.count} />
		</div>
	);
};

export default BountyContainer;