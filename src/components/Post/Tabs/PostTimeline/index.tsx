// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { BountyPostFragment, ChildBountyPostFragment, MotionPostFragment, ProposalPostFragment, ReferendumPostFragment, TechCommitteeProposalPostFragment,TipPostFragment, TreasuryProposalPostFragment } from 'src/generated/graphql';

import TimelineContainer from './TimelineContainer';

interface Props {
	className?: string;
	isBounty?: boolean;
	isMotion?: boolean;
	isProposal?: boolean;
	isReferendum?: boolean;
	isTreasuryProposal?: boolean;
	isTechCommitteeProposal?: boolean;
	isTipProposal?: boolean;
	isChildBounty?: boolean;
	referendumPost: ReferendumPostFragment | undefined;
	proposalPost: ProposalPostFragment | undefined;
	motionPost: MotionPostFragment | undefined;
	treasuryPost: TreasuryProposalPostFragment | undefined;
	tipPost: TipPostFragment | undefined;
	bountyPost: BountyPostFragment | undefined;
	childBountyPost: ChildBountyPostFragment | undefined;
	techCommitteeProposalPost: TechCommitteeProposalPostFragment | undefined;
}

const PostTimeline = ({
	className,
	isBounty,
	isMotion,
	isProposal,
	isReferendum,
	isTreasuryProposal,
	isTechCommitteeProposal,
	isTipProposal,
	isChildBounty,
	referendumPost,
	proposalPost,
	motionPost,
	treasuryPost,
	tipPost,
	bountyPost,
	childBountyPost,
	techCommitteeProposalPost
} : Props) => {
	return (
		<div className={`${className} mt-4`}>
			{ isTechCommitteeProposal &&
				<TimelineContainer
					statuses={techCommitteeProposalPost?.onchain_link?.onchain_tech_committee_proposal?.[0]?.status?.map(s => ({
						blockNumber: s.blockNumber?.number || 0,
						status: s.status || ''
					})) || []}
				/>
			}
			{ isBounty &&
				<TimelineContainer
					statuses={bountyPost?.onchain_link?.onchain_bounty?.[0]?.bountyStatus?.map(s => ({
						blockNumber: s.blockNumber?.number || 0,
						status: s.status || ''
					})) || []}
				/>
			}
			{ isChildBounty &&
					<TimelineContainer
						statuses={childBountyPost?.onchain_link?.onchain_child_bounty?.[0]?.childBountyStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
					/>
			}
			{ isMotion &&
					<TimelineContainer
						statuses={motionPost?.onchain_link?.onchain_motion?.[0]?.motionStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
					/>
			}
			{ isProposal &&
					<TimelineContainer
						statuses={proposalPost?.onchain_link?.onchain_proposal?.[0]?.proposalStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
					/>
			}
			{ isReferendum &&
					<TimelineContainer
						statuses={referendumPost?.onchain_link?.onchain_referendum?.[0]?.referendumStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
					/>
			}
			{ isTreasuryProposal &&
					<TimelineContainer
						statuses={treasuryPost?.onchain_link?.onchain_treasury_spend_proposal?.[0]?.treasuryStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
					/>
			}
			{ isTipProposal &&
					<TimelineContainer
						statuses={tipPost?.onchain_link?.onchain_tip?.[0]?.tipStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
					/>
			}
		</div>
	);
};

export default PostTimeline;