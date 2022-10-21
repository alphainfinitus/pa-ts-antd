// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApolloQueryResult } from 'apollo-client';
import React from 'react';
import { DiscussionPostAndCommentsQuery,DiscussionPostFragment, MotionPostAndCommentsQuery, MotionPostFragment, ProposalPostAndCommentsQuery, ProposalPostFragment, ReferendumPostAndCommentsQuery, ReferendumPostFragment, TipPostAndCommentsQuery, TipPostFragment, TreasuryProposalPostAndCommentsQuery, TreasuryProposalPostFragment } from 'src/generated/graphql';

import PostContent from './PostContent';

interface Props {
	className?: string
	isEditing: boolean
	isTipProposal: boolean
	onchainId?: string | number | null
	post: DiscussionPostFragment | ProposalPostFragment | ReferendumPostFragment | TipPostFragment | TreasuryProposalPostFragment| MotionPostFragment
	postStatus?: string
	refetch: (variables?: any) => Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>>
		| Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>>
		| Promise<ApolloQueryResult<MotionPostAndCommentsQuery>>
		| Promise<ApolloQueryResult<TipPostAndCommentsQuery>>
		| Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>>
		| Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>>
	toggleEdit: () => void
}

const EditablePostContent = ({ className, isTipProposal, onchainId, post, postStatus } : Props) => {
	return (
		<div className={className}>
			<PostContent isTipProposal={isTipProposal} onchainId={onchainId} post={post} postStatus={postStatus}/>
		</div>
	);
};

export default EditablePostContent;