// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { ApolloQueryResult } from 'apollo-client';
import React, { useState } from 'react';
import { DiscussionPostAndCommentsQuery,
	DiscussionPostAndCommentsQueryVariables,
	MotionPostAndCommentsQuery,
	MotionPostAndCommentsQueryVariables,
	ProposalPostAndCommentsQuery,
	ProposalPostAndCommentsQueryVariables,
	ReferendumPostAndCommentsQuery,
	ReferendumPostAndCommentsQueryVariables,
	ReplyFieldsFragment,
	TipPostAndCommentsQuery,
	TipPostAndCommentsQueryVariables,
	TreasuryProposalPostAndCommentsQuery,
	TreasuryProposalPostAndCommentsQueryVariables
} from 'src/generated/graphql';

import Reply from './Reply';

interface Props{
	className?: string
	repliesArr: ReplyFieldsFragment[]
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

const Replies = ({ className, repliesArr, refetch }: Props) => {
	const [showReplies, setShowReplies] = useState<boolean>(false);
	const toggleShowReplies = () => setShowReplies(!showReplies);

	return (
		<div className={className}>
			{repliesArr.length > 0 ?
				!showReplies ?
					<div className='text-sidebarBlue font-medium text-sm border-none cursor-pointer flex items-center' onClick={toggleShowReplies}>{repliesArr.length} replies <DownOutlined className='ml-1' /></div>
					:
					<div className='text-sidebarBlue font-medium text-sm border-none cursor-pointer flex items-center' onClick={toggleShowReplies}>Hide replies <UpOutlined className='ml-1' /></div>
				: null
			}
			{showReplies && repliesArr.map((reply:ReplyFieldsFragment) =>
				<div key={reply.id}>
					<Reply
						reply={reply}
						key={reply.id}
						refetch={refetch}
					/>
				</div>
			)}
		</div>
	);
};

export default Replies;
