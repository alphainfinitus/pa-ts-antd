// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';
import { authorFields } from 'src/fragments/author';
import { commentFields } from 'src/fragments/comments';
import { onchainLinkTreasurySpendProposal } from 'src/fragments/posts';
import { onchainLinkProposalPost } from 'src/fragments/posts';
import { onchainLinkReferendumPost } from 'src/fragments/posts';
import { onchainLinkTechCommitteeProposalPost } from 'src/fragments/posts';
import { onchainLinkBountyPost } from 'src/fragments/posts';
import { onchainLinkMotionPost } from 'src/fragments/posts';

const onchainLinkDiscussion = gql`
    fragment onchainLinkDiscussion on onchain_links {
        id,
        onchain_referendum_id,
        onchain_motion_id,
        onchain_proposal_id,
        onchain_treasury_proposal_id,
    }
`;

const discussionPost = gql`
    fragment discussionPost on posts {
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
            ...onchainLinkDiscussion
        }
        onchain_post_discussion_links {
            discussion_post_id
            onchain_link{
                ...onchainLinkTreasurySpendProposal
                ...onchainLinkProposalPost
                ...onchainLinkMotionPost
                ...onchainLinkBountyPost
                ...onchainLinkReferendumPost
                ...onchainLinkTechCommitteeProposalPost
            }
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
    ${onchainLinkDiscussion}
    ${onchainLinkTreasurySpendProposal}
    ${onchainLinkProposalPost}
    ${onchainLinkMotionPost}
    ${onchainLinkBountyPost}
    ${onchainLinkReferendumPost}
    ${onchainLinkTechCommitteeProposalPost}
`;

export const QUERY_DISCUSSION_POST_AND_COMMENTS = gql`
    query DiscussionPostAndComments ($id:Int!) {
        posts(where: {id: {_eq: $id}}) {
            ...discussionPost
        }
    }
    ${discussionPost}
`;
