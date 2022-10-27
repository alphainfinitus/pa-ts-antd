// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Empty } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import GovernanceCard from 'src/components/GovernanceCard';
import { LatestTechCommitteeProposalPostsQuery } from 'src/generated/graphql';
import { LoadingState } from 'src/ui-components/UIStates';

interface Props {
  className?: string
  data?: LatestTechCommitteeProposalPostsQuery
	loading?: boolean
}

const TechCommProposalsListing = ({ className, data, loading } : Props) => {
	if(!data || loading) return <div className={className}><LoadingState /></div>;

	const noPost = !data.posts || !data.posts.length;
	const atLeastOneCurrentTechCommitteeProposal = data.posts.some((post) => {
		if(post.onchain_link?.onchain_tech_committee_proposal.length){
			// this breaks the loop as soon as
			// we find a post that has a motion.
			return true;
		}
		return false;
	});

	if (noPost || !atLeastOneCurrentTechCommitteeProposal) return <div className={className}><Empty /></div>;

	return (
		<ul className={`${className} motions__list`}>
			{data.posts.map(
				(post) => {
					const onchainId = post.onchain_link?.onchain_tech_committee_proposal_id;

					return !!post?.author?.username && !!post.onchain_link?.onchain_tech_committee_proposal.length &&
						<li key={post.id} className='my-5'>
							{<Link to={`/tech/${onchainId}`}>
								<GovernanceCard
									address={post.onchain_link.proposer_address}
									comments={post.comments_aggregate.aggregate?.count
										? post.comments_aggregate.aggregate.count.toString()
										: 'no'}
									method={post.onchain_link.onchain_tech_committee_proposal[0]?.preimage?.method}
									onchainId={onchainId}
									status={post.onchain_link.onchain_tech_committee_proposal[0]?.status?.[0].status}
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

export default TechCommProposalsListing;