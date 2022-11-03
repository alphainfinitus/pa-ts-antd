// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FormOutlined } from '@ant-design/icons';
import { QueryLazyOptions } from '@apollo/client';
import { Button } from 'antd';
import React from 'react';
import { DiscussionPostFragment, Exact, MotionPostFragment,ProposalPostFragment, ReferendumPostFragment,  TreasuryProposalPostFragment } from 'src/generated/graphql';
import Markdown from 'src/ui-components/Markdown';

import CreateOptionPoll from '../ActionsBar/OptionPoll/CreateOptionPoll';
import PostReactionBar from '../ActionsBar/Reactionbar/PostReactionBar';
import ReportButton from '../ActionsBar/ReportButton';
import ShareButton from '../ActionsBar/ShareButton';
import SubscriptionButton from '../ActionsBar/SubscriptionButton/SubscriptionButton';
import Comments from '../Comment/Comments';
import PostCommentForm from '../PostCommentForm';

interface Props {
	className?: string;
	canEdit: boolean | '' | undefined;
	id: number | null | undefined;
	isEditing: boolean;
	isOnchainPost: boolean;
	post: DiscussionPostFragment | ProposalPostFragment | ReferendumPostFragment| TreasuryProposalPostFragment| MotionPostFragment;
	toggleEdit: () => void
	TrackerButtonComp: JSX.Element
	Sidebar: ({ className }: {className?: string | undefined;}) => JSX.Element
	refetch: ((options?: QueryLazyOptions<Exact<{
		id: number;
	}>> | undefined) => void) | ((options?: QueryLazyOptions<Exact<{
		hash: string;
	}>> | undefined) => void)
}

const PostDescription = ({ className, canEdit, id, isEditing, isOnchainPost, post, refetch, toggleEdit, Sidebar, TrackerButtonComp } : Props) => {
	const { content } = post;
	return (
		<div className={`${className} mt-4`}>
			{content && <Markdown md={content} />}

			{/* Actions Bar */}
			<div id='actions-bar' className="flex items-center flex-col md:flex-row mb-8">
				<div className='flex items-center'>
					<PostReactionBar className='reactions' postId={post.id} />
					{id && !isEditing && <SubscriptionButton postId={post.id}/>}
					{canEdit && <Button className={'text-pink_primary flex items-center border-none shadow-none'} onClick={toggleEdit}><FormOutlined />Edit</Button>}
				</div>
				<div className='flex items-center'>
					{id && !isEditing && !isOnchainPost && <ReportButton type='post' contentId={`${post.id}`} />}
					{canEdit && !isEditing && <CreateOptionPoll postId={post.id} />}
					{TrackerButtonComp}
					<ShareButton title={post.title} />
				</div>
			</div>

			{!isEditing && <div className='flex lg:hidden mb-8 mx-2'><Sidebar /></div>}

			{ id && <PostCommentForm postId={post.id} refetch={refetch} /> }

			{ !!post.comments?.length &&
				<Comments
					className='ml-0 md:ml-4'
					comments={post.comments}
					refetch={refetch}
				/>
			}
		</div>
	);
};

export default PostDescription;