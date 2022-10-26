// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { ApolloQueryResult } from 'apollo-client';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CommentFieldsFragment, DiscussionPostAndCommentsQuery,DiscussionPostAndCommentsQueryVariables, MotionPostAndCommentsQuery, MotionPostAndCommentsQueryVariables, ProposalPostAndCommentsQuery, ProposalPostAndCommentsQueryVariables, ReferendumPostAndCommentsQuery, ReferendumPostAndCommentsQueryVariables, TipPostAndCommentsQuery, TipPostAndCommentsQueryVariables, TreasuryProposalPostAndCommentsQuery, TreasuryProposalPostAndCommentsQueryVariables } from 'src/generated/graphql';
import CreationLabel from 'src/ui-components/CreationLabel';
import UpdateLabel from 'src/ui-components/UpdateLabel';
import UserAvatar from 'src/ui-components/UserAvatar';
import getDefaultAddressField from 'src/util/getDefaultAddressField';

import EditableCommentContent from './EditableCommentContent';
import Replies from './Replies';

interface Props{
	className?: string,
	comment: CommentFieldsFragment,
	refetch: (variables?:
		ReferendumPostAndCommentsQueryVariables |
		DiscussionPostAndCommentsQueryVariables |
		ProposalPostAndCommentsQueryVariables |
		MotionPostAndCommentsQueryVariables |
		TipPostAndCommentsQueryVariables |
		TreasuryProposalPostAndCommentsQueryVariables |
		undefined) =>
		Promise<ApolloQueryResult<TipPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<MotionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>>
}

export const Comment = ({ className, comment, refetch } : Props) => {
	const { author, content, created_at, id, replies, updated_at } = comment;
	const { hash } = useLocation();
	const commentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (hash === `#${id}`) {
			window.scrollTo(0, commentRef.current?.offsetTop || 0);
		}
	}, [hash, id]);

	if (!author || !author.id || !author.username || !content) return <div>Comment not available</div>;

	const defaultAddressField = getDefaultAddressField();
	const defaultAddress = author[defaultAddressField];

	return (
		<div id={id} ref={commentRef} className={className}>
			<UserAvatar
				className='mt-1 hidden md:inline-block'
				username={author.username}
				size='large'
				id={author.id}
			/>
			<div className='comment-box'>
				<CreationLabel
					className='creation-label'
					created_at={created_at}
					defaultAddress={defaultAddress}
					text={'commented'}
					username={author.username}
					hideCreatedAt={true}
				>
					<UpdateLabel
						created_at={created_at}
						updated_at={updated_at}
					/>
				</CreationLabel>
				<EditableCommentContent
					authorId={author.id}
					created_at={created_at}
					className='comment-content'
					comment={comment}
					commentId={id}
					content={content}
					refetch={refetch}
				/>
				<Replies className='comment-content' repliesArr={replies} refetch={refetch} />
			</div>
		</div>
	);
};

export default styled(Comment)`
	display: flex;
	.comment-box {
		background-color: white;
		border-radius: 3px;
		box-shadow: box_shadow_card;
		margin-bottom: 1rem;
		width: calc(100% - 60px);
		word-break: break-word;

		@media only screen and (max-width: 576px) {
			width: 100%;
			border-radius: 0px;
		}
	}

	.creation-label {
		display: inline-flex;
		padding: 1rem 0 0.8rem 2rem;
		margin-bottom: 0;

		@media only screen and (max-width: 576px) {
			padding: 1rem 0 0.8rem 0;
		}

	}

	.comment-content {
		padding: 0.8rem 2rem;
		width: 100%;

		@media only screen and (max-width: 576px) {
			padding: 0.8rem 1rem;
		}
	}
`;
