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
	handleOpenSidebar: (address: string) => void;
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
	definedOnchainLink,
	handleOpenSidebar
} : Props) => {

	return (
		<>
			<div className={`${className} mt-4`}>
				{ isTechCommitteeProposal &&
					<PostTechCommitteeProposalInfo
						onchainLink={definedOnchainLink as OnchainLinkTechCommitteeProposalFragment}
						setOtherProposalsSidebarAddr={handleOpenSidebar}
					/>
				}
				{ isBounty &&
					<PostBountyInfo
						onchainLink={definedOnchainLink as OnchainLinkBountyFragment}
						setOtherProposalsSidebarAddr={handleOpenSidebar}
					/>
				}
				{ isChildBounty &&
					<PostChildBountyInfo
						onchainLink={definedOnchainLink as OnchainLinkChildBountyFragment}
						setOtherProposalsSidebarAddr={handleOpenSidebar}
					/>
				}
				{ isMotion &&
					<PostMotionInfo
						onchainLink={definedOnchainLink as OnchainLinkMotionFragment}
						setOtherProposalsSidebarAddr={handleOpenSidebar}
					/>
				}
				{ isProposal &&
					<PostProposalInfo
						onchainLink={definedOnchainLink as OnchainLinkProposalFragment}
						setOtherProposalsSidebarAddr={handleOpenSidebar}
					/>
				}
				{ isReferendum &&
					<PostReferendumInfo
						onchainLink={definedOnchainLink as OnchainLinkReferendumFragment}
						setOtherProposalsSidebarAddr={handleOpenSidebar}
					/>
				}
				{ isTreasuryProposal &&
					<PostTreasuryInfo
						onchainLink={definedOnchainLink as OnchainLinkTreasuryProposalFragment}
						setOtherProposalsSidebarAddr={handleOpenSidebar}
					/>
				}
				{ isTipProposal &&
					<PostTipInfo
						onchainLink={definedOnchainLink as OnchainLinkTipFragment}
						setOtherProposalsSidebarAddr={handleOpenSidebar}
					/>
				}
			</div>
		</>
	);
};

export default PostOnChainInfo;