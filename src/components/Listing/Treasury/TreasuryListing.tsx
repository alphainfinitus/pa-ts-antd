// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Link } from 'react-router-dom';
import GovernanceCard from 'src/components/GovernanceCard';
import { GetLatestDemocracyTreasuryProposalPostsQuery } from 'src/generated/graphql';
import { LoadingState, PostEmptyState } from 'src/ui-components/UIStates';

interface Props {
  className?: string
  data?: GetLatestDemocracyTreasuryProposalPostsQuery
	loading?: boolean
}

const TreasuryListing = ({ className, data, loading } : Props) => {
	if(!data || loading) return <div className={className}><LoadingState /></div>;

	if (!data.posts || !data.posts.length) return <div className={className}><PostEmptyState /></div>;

	return (
		<ul className={`${className}`}>
			{data.posts.map(
				(post) => {
					const onchainId = post.onchain_link?.onchain_treasury_proposal_id;

					return !!post?.author?.username && post.onchain_link &&
						<li key={post.id} className='my-5'>
							{<Link to={`/treasury/${onchainId}`}>
								<GovernanceCard
									address={post.onchain_link.proposer_address}
									comments={post.comments_aggregate.aggregate?.count
										? post.comments_aggregate.aggregate.count.toString()
										: 'no'}
									onchainId={onchainId}
									status={post.onchain_link.onchain_treasury_spend_proposal?.[0]?.treasuryStatus?.[0].status}
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