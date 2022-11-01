// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { OnchainLinkBountyFragment, OnchainLinkChildBountyFragment, OnchainLinkMotionFragment, OnchainLinkProposalFragment, OnchainLinkReferendumFragment, OnchainLinkTechCommitteeProposalFragment, OnchainLinkTipFragment, OnchainLinkTreasuryProposalFragment } from 'src/generated/graphql';

import PostBountyInfo from './PostBountyInfo';
import PostChildBountyInfo from './PostChildBountyInfo';
import PostMotionInfo from './PostMotionInfo';
import PostProposalInfo from './PostProposalInfo';
import PostReferendumInfo from './PostReferendumInfo';
import PostTechCommitteeProposalInfo from './PostTechCommitteeProposalInfo';
import PostTipInfo from './PostTipInfo';
import PostTreasuryInfo from './PostTreasuryInfo';

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
	definedOnchainLink: OnchainLinkTechCommitteeProposalFragment | OnchainLinkBountyFragment | OnchainLinkChildBountyFragment | OnchainLinkMotionFragment | OnchainLinkReferendumFragment | OnchainLinkProposalFragment | OnchainLinkTipFragment | OnchainLinkTreasuryProposalFragment | undefined;
}

const PostOnChainInfo = ({
	className,
	isBounty,
	isMotion,
	isProposal,
	isReferendum,
	isTreasuryProposal,
	isTechCommitteeProposal,
	isTipProposal,
	isChildBounty,
	definedOnchainLink
} : Props) => {
	return (
		<div className={`${className} mt-4`}>
			{ isTechCommitteeProposal &&
				<PostTechCommitteeProposalInfo
					onchainLink={definedOnchainLink as OnchainLinkTechCommitteeProposalFragment}
					setOtherProposalsSidebarAddr={() => console.log('open all proposals sidebar')}
				/>
			}
			{ isBounty &&
				<PostBountyInfo
					onchainLink={definedOnchainLink as OnchainLinkBountyFragment}
					setOtherProposalsSidebarAddr={() => console.log('open all proposals sidebar')}
				/>
			}
			{ isChildBounty &&
				<PostChildBountyInfo
					onchainLink={definedOnchainLink as OnchainLinkChildBountyFragment}
					setOtherProposalsSidebarAddr={() => console.log('open all proposals sidebar')}
				/>
			}
			{ isMotion &&
				<PostMotionInfo
					onchainLink={definedOnchainLink as OnchainLinkMotionFragment}
					setOtherProposalsSidebarAddr={() => console.log('open all proposals sidebar')}
				/>
			}
			{ isProposal &&
				<PostProposalInfo
					onchainLink={definedOnchainLink as OnchainLinkProposalFragment}
					setOtherProposalsSidebarAddr={() => console.log('open all proposals sidebar')}
				/>
			}
			{ isReferendum &&
				<PostReferendumInfo
					onchainLink={definedOnchainLink as OnchainLinkReferendumFragment}
					setOtherProposalsSidebarAddr={() => console.log('open all proposals sidebar')}
				/>
			}
			{ isTreasuryProposal &&
				<PostTreasuryInfo
					onchainLink={definedOnchainLink as OnchainLinkTreasuryProposalFragment}
					setOtherProposalsSidebarAddr={() => console.log('open all proposals sidebar')}
				/>
			}
			{ isTipProposal &&
				<PostTipInfo
					onchainLink={definedOnchainLink as OnchainLinkTipFragment}
					setOtherProposalsSidebarAddr={() => console.log('open all proposals sidebar')}
				/>
			}
		</div>
	);
};

export default PostOnChainInfo;