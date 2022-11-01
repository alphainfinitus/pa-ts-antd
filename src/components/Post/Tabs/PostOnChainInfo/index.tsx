// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { OnchainLinkBountyFragment, OnchainLinkChildBountyFragment, OnchainLinkMotionFragment, OnchainLinkProposalFragment, OnchainLinkReferendumFragment, OnchainLinkTechCommitteeProposalFragment, OnchainLinkTipFragment, OnchainLinkTreasuryProposalFragment } from 'src/generated/graphql';

import PostTechCommitteeProposalInfo from './PostTechCommitteeProposalInfo';

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
						setOtherProposalsSidebarAddr={() => {console.log('open all proposals sidebar');}}
					/>
			}
			{ isBounty &&
					<h1>OnchainInfo</h1>
			}
			{ isChildBounty &&
					<h1>OnchainInfo</h1>
			}
			{ isMotion &&
					<h1>OnchainInfo</h1>
			}
			{ isProposal &&
					<h1>OnchainInfo</h1>
			}
			{ isReferendum &&
					<h1>OnchainInfo</h1>
			}
			{ isTreasuryProposal &&
					<h1>OnchainInfo</h1>
			}
			{ isTipProposal &&
					<h1>OnchainInfo</h1>
			}
		</div>
	);
};

export default PostOnChainInfo;