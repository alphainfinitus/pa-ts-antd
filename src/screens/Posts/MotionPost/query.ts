// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';
import { authorFields } from 'src/fragments/author';
import { commentFields } from 'src/fragments/comments';
import { onchainLinkProposalPost } from 'src/fragments/posts';
import { onchainLinkDiscussionPost } from 'src/fragments/posts';
import { onchainLinkReferendumPost } from 'src/fragments/posts';
import { onchainLinkTechCommitteeProposalPost } from 'src/fragments/posts';
import { onchainLinkTreasurySpendProposal } from 'src/fragments/posts';
import { onchainLinkBountyPost } from 'src/fragments/posts';

const onchainLinkMotionPreimage = gql`
    fragment onchainLinkMotionPreimage on Preimage {
        hash
        id
        metaDescription
        method
        preimageArguments {
            id
            name
            value
        }
    }
`;

const onchainLinkMotionTreasury = gql`
    fragment onchainLinkMotionTreasury on TreasurySpendProposal {
        beneficiary
        bond
        value
    }
`;

const onchainLinkMotion = gql`
    fragment onchainLinkMotion on onchain_links {
        id,
        proposer_address,
        onchain_referendum_id,
        onchain_motion_id,
        onchain_motion(where: {}) {
            id
            motionStatus(orderBy: id_DESC) {
                id
                status
                blockNumber {
                  number
                }
            }
            memberCount
            method
            motionProposalHash
            motionProposalArguments{
                name
                value
            }
            preimage {
                ...onchainLinkMotionPreimage
            }
            treasurySpendProposal{
                ...onchainLinkMotionTreasury
            }
        }
    }
    ${onchainLinkMotionPreimage}
    ${onchainLinkMotionTreasury}
`;

const motionPost = gql`
    fragment motionPost on posts {
        author {
            ...authorFields
        }
        content
        created_at
        id
        updated_at
        comments(order_by: {created_at: asc}) {
            ...commentFields
        }
        onchain_link{
            ...onchainLinkMotion
            ...onchainLinkBountyPost
            ...onchainLinkProposalPost
            ...onchainLinkDiscussionPost
            ...onchainLinkReferendumPost
            ...onchainLinkTechCommitteeProposalPost
            ...onchainLinkTreasurySpendProposal
        }
        title
        topic {
            id
            name
        }
        type {
            id
            name
        }
    }
    ${authorFields}
    ${commentFields}
    ${onchainLinkMotion}
    ${onchainLinkBountyPost}
    ${onchainLinkProposalPost}
    ${onchainLinkDiscussionPost}
    ${onchainLinkReferendumPost}
    ${onchainLinkTechCommitteeProposalPost}
    ${onchainLinkTreasurySpendProposal}
`;

export const QUERY_MOTION_POST_AND_COMMENTS = gql`
    query MotionPostAndComments ($id:Int!) {
        posts(where: {onchain_link: {onchain_motion_id: {_eq: $id}}}) {
            ...motionPost
        }
    }
    ${motionPost}
`;

