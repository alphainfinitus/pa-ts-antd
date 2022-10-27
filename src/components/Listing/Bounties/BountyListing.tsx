// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Empty } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import GovernanceCard from 'src/components/GovernanceCard';
import { GetLatestBountyPostsQuery } from 'src/generated/graphql';
import { LoadingState } from 'src/ui-components/UIStates';

interface Props {
  className?: string
  data?: GetLatestBountyPostsQuery
	loading?: boolean
}

const TreasuryListing = ({ className, data, loading } : Props) => {
	if(!data || loading) return <div className={className}><LoadingState /></div>;

	const noPost = !data.posts || !data.posts.length;
	const atLeastOneCurrentBounty = data.posts.some((post) => {
		if (post.onchain_link?.onchain_bounty.length){
			// this breaks the loop as soon as
			// we find a post that has a bounty.
			return true;
		}
		return false;
	});

	if (noPost || !atLeastOneCurrentBounty) return <div className={className}><Empty /></div>;

	return (
		<ul className={`${className} bounties__list`}>
			{data.posts.map(
				(post) => {
					const onchainId = post.onchain_link?.onchain_bounty_id;

					return !!post?.author?.username && !!post.onchain_link?.onchain_bounty.length &&
						<li key={post.id} className='my-5'>
							{<Link to={`/bounty/${onchainId}`}>
								<GovernanceCard
									address={post.onchain_link.proposer_address}
									comments={post.comments_aggregate.aggregate?.count
										? post.comments_aggregate.aggregate.count.toString()
										: 'no'}
									onchainId={onchainId}
									status={post.onchain_link.onchain_bounty[0]?.bountyStatus?.[0].status}
									title={post.title}
									topic={post.topic.name}
								/>
							</Link>}
						</li>
					;
				}
			)}
		</ul>
	);
};

export default TreasuryListing;