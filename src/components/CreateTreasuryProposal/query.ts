// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

export const ADD_POLKASSEMBLY_PROPOSAL = gql`

mutation AddPolkassemblyProposal( $authorId: Int!, $proposalId:Int!, $proposalType: Int!, $proposalHash: String!,  $title: String!, $content: String!, $proposerAddress: String! ) {
    __typename
    insert_polkassembly_proposals(objects: {author_id: $authorId, proposal_id: $proposalId, proposal_type: $proposalType, proposal_hash: $proposalHash, content:  $content, title: $title, proposer_address: $proposerAddress}) {
        affected_rows
    }
}
`;