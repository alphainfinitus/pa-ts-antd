// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

export const ABOUT = gql`
    query ABOUT($network: String!, $address: String!) {
        about(network: $network, address: $address) {
            network
            address
            title
            description
            image
        }
    }
`;

export const CHANGE_ABOUT = gql`
    mutation changeAbout($network: String!, $address: String!, $title: String!, $description: String!, $image: String!, $signature: String!) {
        changeAbout(network: $network, address: $address, title: $title, description: $description, image: $image, signature: $signature) {
            message
        }
    }
`;
