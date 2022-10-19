// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Pagination } from 'antd';
import React, { useState } from 'react';
import { useDiscussionPostsIdAscQuery, useDiscussionPostsIdDescQuery, useDiscussionsCountQuery, useLatestDiscussionPostsQuery } from 'src/generated/graphql';
import { sortValues } from 'src/global/sortOptions';
import { ErrorState } from 'src/ui-components/UIStates';
import { handlePaginationChange } from 'src/util/handlePaginationChange';

import DiscussionsListing from './DiscussionsListing';

const LIMIT = 10;

const DiscussionListingWrapper = ({ className, sortBy } : { className?:string, sortBy:string }) => {
	const [offset, setOffset] = useState(0);

	let postsQuery: typeof useDiscussionPostsIdDescQuery | typeof useDiscussionPostsIdAscQuery | typeof useLatestDiscussionPostsQuery;

	if (sortBy === sortValues.NEWEST)
		postsQuery = useDiscussionPostsIdDescQuery;
	else if (sortBy === sortValues.OLDEST) {
		postsQuery = useDiscussionPostsIdAscQuery;
	} else {
		postsQuery = useLatestDiscussionPostsQuery;
	}

	// TODO: Enable Refetch
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data, error, loading, refetch } = postsQuery({ variables: { limit: LIMIT, offset } });

	// TODO: Enable Refetch
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: countData, loading:countLoading, refetch:countRefetch } = useDiscussionsCountQuery();

	const onPaginationChange = (page:number) => {
		handlePaginationChange({ LIMIT, page, setOffset });
	};

	if (error?.message) {
		return <ErrorState errorMessage={error.message} />;
	}

	return (
		<div className={className}>
			<DiscussionsListing loading={loading} data={data} />
			<div className='flex justify-end mt-6'>
				{
					!countLoading && countData?.posts_aggregate.aggregate?.count &&
					countData?.posts_aggregate.aggregate?.count > 0 && countData?.posts_aggregate.aggregate?.count > LIMIT &&
						<Pagination
							defaultCurrent={1}
							pageSize={LIMIT}
							total={countData.posts_aggregate.aggregate.count}
							showSizeChanger={false}
							hideOnSinglePage={true}
							onChange={onPaginationChange}
						/>
				}
			</div>
		</div>
	);
};

export default DiscussionListingWrapper;