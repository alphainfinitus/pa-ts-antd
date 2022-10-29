// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';
import { authorFields } from 'src/fragments/author';
import { commentFields } from 'src/fragments/comments';

const onchainLinkChildBounty = gql`
    fragment onchainLinkChildBounty on onchain_links {
        id,
        proposer_address,
        onchain_child_bounty_id,
        onchain_child_bounty(where: {}) {
            id
            proposer
            value
            fee
            curatorDeposit
            parentBountyId
            childBountyId
            curator
            beneficiary
            description
            childBountyStatus(orderBy: id_DESC) {
                id
                status
                blockNumber {
                    startDateTime
                    number
                }
            }
        }
    }
`;

const childBountyPost = gql`
    fragment childBountyPost on posts {
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
            ...onchainLinkChildBounty
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
    ${onchainLinkChildBounty}
`;

export const QUERY_CHILD_BOUNTY_POST_AND_COMMENTS = gql`
    query ChildBountyPostAndComments ($id: Int!) {
        posts(where: {onchain_link: {onchain_child_bounty_id: {_eq: $id}}}) {
            ...childBountyPost
        }
    }
    ${childBountyPost}
`;

