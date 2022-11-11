// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

export const onchainLinkProposalPost = gql`
    fragment onchainLinkProposalPost on onchain_links {
        onchain_proposal {
            proposalId
            proposalStatus(first: 1) {
                blockNumber {
                    number
                }
            }
        }
    }
`;

export const onchainLinkBountyPost = gql`
    fragment onchainLinkBountyPost on onchain_links {
        onchain_bounty {
            bountyId
            bountyStatus(first: 1) {
                blockNumber {
                    number
                }
            }
        }
    }
`;

export const onchainLinkMotionPost = gql`
    fragment onchainLinkMotionPost on onchain_links {
        onchain_motion {
            motionProposalId
            motionStatus(first: 1) {
                blockNumber {
                    number
                }
            }
        }
    }
`;

export const onchainLinkReferendumPost = gql`
    fragment onchainLinkReferendumPost on onchain_links {
        onchain_referendum {
            referendumId
            referendumStatus(first: 1) {
                blockNumber {
                    number
                }
            }
        }
    }
`;

export const onchainLinkTechCommitteeProposalPost = gql`
    fragment onchainLinkTechCommitteeProposalPost on onchain_links {
        onchain_tech_committee_proposal {
            proposalId
            status(first: 1) {
                blockNumber {
                    number
                }
            }
        }
    }
`;

export const onchainLinkTreasurySpendProposal = gql`
    fragment onchainLinkTreasurySpendProposal on onchain_links {
        onchain_treasury_spend_proposal {
            treasuryProposalId
            treasuryStatus(first: 1) {
                blockNumber {
                    number
                }
            }
        }
    }
`;

export const onchainLinkDiscussionPost = gql`
    fragment onchainLinkDiscussionPost on onchain_links {
        onchain_post_discussion_links {
            discussion_post_id
        }
    }
`;