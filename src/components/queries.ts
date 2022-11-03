// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

export const GET_REFRESH_TOKEN = gql`
query GET_REFRESH_TOKEN {
    token {
        token
    }
}
`;

export const GET_CALENDER_EVENTS = gql`
    query GetCalenderEvents($network: String!, $approval_status: String!) {
        calender_events(where: {network: {_ilike: $network}, approval_status: {_eq: $approval_status}}) {
            content
            end_time
            id
            module
            network
            start_time
            title
            url
            event_type
            event_id
            status
            approval_status
            location
        }
    }
`;

export const DELETE_CALENDER_EVENT = gql`
    mutation DeleteCalenderEvent ($id: Int!) {
        delete_calender_events(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }
`;

export const UPDATE_APPROVAL_STATUS = gql`
    mutation UpdateApprovalStatus ($id: Int!, $approval_status: String!) {
        update_calender_events(where: {id: {_eq: $id}}, _set: {approval_status: $approval_status}) {
            affected_rows
        }
    }
`;

export const ADD_CALENDER_EVENT = gql`
    mutation AddCalenderEvent ($title: String!, $start_time: timestamptz!, $content: String, $end_time: timestamptz!, $url: String, $module: String, $network: String!, $event_type: String!, $user_id: Int, $location: String) {
        insert_calender_events(objects: {title: $title, start_time: $start_time, end_time: $end_time, content: $content, url: $url, module: $module, network: $network, event_type: $event_type, user_id: $user_id, location: $location}) {
            affected_rows
        }
    }
`;

export const ADD_BIO_IMAGE=gql`
    mutation addProfile ($image: String, $bio: String, $user_id: Int!, $title: String, $badges: String) {
        addProfile(image: $image, bio: $bio, user_id: $user_id, title: $title, badges: $badges) {
            message
        }
    }
`;

export const GET_USER_DETAILS = gql`
    query GetUserDetails($user_id: Int!) {
        userDetails(user_id: $user_id) {
            bio
            image
            user_id
            title
            badges
        }
    }
`;

export const LINK_DISCUSSION_TO_ONCHAIN_POST = gql`
    mutation linkDiscussionToOnchainPost($discussion_id: Int!, $onchain_link_id: Int!, $author_id: Int!) {
        insert_onchain_post_discussion_link(objects: {discussion_post_id: $discussion_id, onchain_link_id: $onchain_link_id, author_id: $author_id}) {
            affected_rows
    }
  }
`;

export const GET_DISCUSSION_TO_ONCHAIN_POST_BY_ONCHAIN_ID = gql`
    query GetDiscussionToOnchainPostByOnchainId($onchain_link_id: Int!){   
        onchain_post_discussion_link(where: {onchain_link_id: {_eq: $onchain_link_id}}, order_by: {updated_at: desc}) {
            author_id
            discussion_post_id
            id
            onchain_link_id
        }
    }
`;

export const GET_DISCUSSION_TO_ONCHAIN_POST_BY_DISCUSSION_ID = gql`
    query GetDiscussionToOnchainPostByDiscussionId($discussion_post_id: Int!){   
        onchain_post_discussion_link(where: {discussion_post_id: {_eq: $discussion_post_id}}, order_by: {updated_at: desc}) {
            author_id
            discussion_post_id
            id
            onchain_link_id
        }
    }
`;

export const GET_PROPOSAL_STATUS = gql`
    query GetProposalStatus($onchain_proposal_id: Int!) {
        proposal_tracker(where: {onchain_proposal_id: {_eq: $onchain_proposal_id}}) {
            deadline
            id
            onchain_proposal_id
            status
        }
    }
`;

export const PROPOSAL_STATUS_TRACKER_MUTATION = gql`
    mutation createProposalTracker($deadline: String!, $network: String!, $onchain_proposal_id: Int!, $status: String!, $start_time: String!) {
        createProposalTracker(deadline: $deadline, network: $network, onchain_proposal_id: $onchain_proposal_id, status: $status, start_time: $start_time) {
            message
        }
    }
`;

export const UPDATE_PROPOSAL_TRACKER_MUTATION = gql`
    mutation updateProposalTracker($id: Int!, $status: String!) {
        updateProposalTracker(id: $id, status: $status) {
            message
        }
    }
`;

export const EDIT_CALENDER_EVENT= gql`
    mutation EditCalenderEvent ($id: Int!, $title: String!, $start_time: timestamptz!, $content: String, $end_time: timestamptz!, $url: String, $module: String, $network: String!, $event_type: String!, $location: String) {
        update_calender_events(where: {id: {_eq: $id}}, _set: {title: $title, content: $content, start_time: $start_time, end_time: $end_time, url: $url, module: $module, network: $network, approval_status: "pending", event_type: $event_type, location: $location}) {
            affected_rows
        }
    }
`;

export const GET_CHILD_BOUNTIES_OF_PARENT_BOUNTY = gql`
    query GetChildBountiesOfParentBounty($parent_bounty_id: Int!) {
        childBounties(where: {parentBountyId: $parent_bounty_id}) {
            beneficiary
            childBountyId
            childBountyStatus {
                id
                status
                uniqueStatus
            }
            curator
            curatorDeposit
            description
            fee
            id
            parentBountyId
            proposer
            value
        }
    }
`;

export const GET_USERS_PROPOSALS = gql`
query GetUsersProposals($proposer_address: String!) {
    posts(where: {_or: [{onchain_link: {onchain_proposal_id: {_is_null: false}}}, {onchain_link: {onchain_treasury_proposal_id: {_is_null: false}}}], onchain_link: {proposer_address: {_eq: $proposer_address}}}) {
      id
      author_id
      content
      title
      topic_id
      created_at
      onchain_link {
        id
        onchain_proposal_id
        onchain_treasury_proposal_id
        onchain_treasury_spend_proposal {
          beneficiary
          treasuryProposalId
          value
          treasuryStatus(last: 1) {
            status
          }
        }
        proposer_address
        onchain_proposal {
          depositAmount
          author
          id
          proposalId
          preimageHash
          proposalStatus(last: 1) {
            status
            id
          }
        }
      }
      type {
        name
        id
      }
      topic {
        id
        name
      }
    }
  }
`;

export const GET_USER_WITH_USERNAME = gql`
    query userWithUsername($username: String!){
        userWithUsername(username: $username) {
            badges
            bio
            id
            image
            title
            user_id
        }
    }
`;