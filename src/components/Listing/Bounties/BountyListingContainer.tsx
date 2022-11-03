// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAllBountyPostsLazyQuery } from 'src/generated/graphql';
import { post_topic } from 'src/global/post_topics';
import { post_type } from 'src/global/post_types';
import { ErrorState } from 'src/ui-components/UIStates';
import { handlePaginationChange } from 'src/util/handlePaginationChange';

import BountyListing from './BountyListing';

const LIMIT = 10;

const BountyListingContainer = ({ className, count } : { className?:string, count: number | null | undefined }) => {
	const [offset, setOffset] = useState(0);

	const [refetch, { data, error, loading }] = useAllBountyPostsLazyQuery({ variables: {
		limit: LIMIT,
		offset,
		postTopic: post_topic.TREASURY,
		postType: post_type.ON_CHAIN
	} });
	useEffect(() => {
		refetch();
	}, [refetch]);

	const onPaginationChange = (page:number) => {
		handlePaginationChange({ LIMIT, page, setOffset });
	};

	if (error?.message) {
		return <ErrorState errorMessage={error.message} />;
	}

	return (
		<div className={className}>
			<BountyListing loading={loading} data={data} />
			<div className='flex justify-end mt-6'>
				{
					count && count > 0 && count > LIMIT &&
						<Pagination
							defaultCurrent={1}
							pageSize={LIMIT}
							total={count}
							showSizeChanger={false}
							hideOnSinglePage={true}
							onChange={onPaginationChange}
							responsive={true}
						/>
				}
			</div>
		</div>
	);
};

export default BountyListingContainer;