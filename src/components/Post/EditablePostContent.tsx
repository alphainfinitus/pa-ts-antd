// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryLazyOptions } from '@apollo/client';
import { Empty } from 'antd';
import React from 'react';
import { DiscussionPostFragment, Exact,  MotionPostFragment, ProposalPostFragment,  ReferendumPostFragment, TipPostFragment, TreasuryProposalPostFragment } from 'src/generated/graphql';

import PostContentForm from './PostContentForm';

interface Props {
	className?: string
	post: DiscussionPostFragment | ProposalPostFragment | ReferendumPostFragment | TipPostFragment | TreasuryProposalPostFragment| MotionPostFragment
	refetch: ((options?: QueryLazyOptions<Exact<{
		id: number;
	}>> | undefined) => void) | ((options?: QueryLazyOptions<Exact<{
		hash: string;
	}>> | undefined) => void)
	toggleEdit: () => void
}

const EditablePostContent = ({ className, post, toggleEdit, refetch } : Props) => {
	const { author, content, title } = post;

	if (!author || !author.username || !content) return (
		<div className='h-[500px] max-h-[70vh] flex items-center justify-center'>
			<Empty
				description={
					<span className='text-xl'>
						Post content or author could not be found.
					</span>
				}
			/>
		</div>
	);

	return (
		<div className={className}>
			<PostContentForm postId={post.id} title={title} content={post.content} toggleEdit={toggleEdit} refetch={refetch} />
		</div>
	);
};

export default EditablePostContent;