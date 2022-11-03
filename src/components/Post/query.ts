// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

export const EDIT_POST= gql`
    mutation EditPost ($id: Int!, $content: String!, $title: String!) {
        update_posts(where: {id: {_eq: $id}}, _set: {content: $content, title: $title}) {
            affected_rows
        }
  }
`;

export const ADD_POST_COMMENT=gql`
    mutation AddPostComment ($authorId: Int!, $content: String!, $postId: Int!) {
        __typename
        insert_comments(objects: {author_id: $authorId, content:  $content, post_id: $postId}) {
            affected_rows
        }
    }
`;

export const ADD_COMMENT_REPLY=gql`
    mutation AddCommentReply ($authorId: Int!, $content: String!, $commentId: uuid!) {
        __typename
        insert_replies(objects: {author_id: $authorId, content:  $content, comment_id: $commentId}) {
            affected_rows
        }
    }
`;

export const EDIT_COMMENT_REPLY= gql`
    mutation EditCommentReply ($id: uuid!, $content: String!) {
        update_replies(where: {id: {_eq: $id}}, _set: {content: $content}) {
            affected_rows
        }
  }
`;

export const DELETE_COMMENT_REPLY= gql`
    mutation DeleteCommentReply ($id: uuid!) {
        delete_replies(where: {id: {_eq: $id}}) {
            affected_rows
    }
}
`;