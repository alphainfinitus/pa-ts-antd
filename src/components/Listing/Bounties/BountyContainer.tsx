// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useBountiesCountQuery } from 'src/generated/graphql';
import { post_type } from 'src/global/post_types';

import BountyListingWrapper from './BountyListingWrapper';

const BountyContainer = ({ className } : { className?:string }) => {
	// TODO: Enable Refetch
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data, refetch } = useBountiesCountQuery({ variables: {
		postType: post_type.ON_CHAIN
	} });

	return (
		<div className={`${className} shadow-md bg-white p-3 md:p-8 rounded-md`}>
			<div className='flex items-center justify-between'>
				<h1 className='dashboard-heading'>{ data?.posts_aggregate.aggregate?.count } Bounties</h1>
			</div>

			<BountyListingWrapper className='mt-6' count={data?.posts_aggregate.aggregate?.count} />
		</div>
	);
};

export default BountyContainer;