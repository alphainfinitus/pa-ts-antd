// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryLazyOptions } from '@apollo/client';
import React from 'react';
import { CommentFieldsFragment, Exact } from 'src/generated/graphql';

import Comment from './Comment';

interface Props{
	className?: string
	comments: CommentFieldsFragment[]
	refetch: ((options?: QueryLazyOptions<Exact<{
		id: number;
	}>> | undefined) => void) | ((options?: QueryLazyOptions<Exact<{
		hash: string;
	}>> | undefined) => void)
}

const Comments = ({ className, comments, refetch }: Props) => {
	return (
		<div className={className}>
			<div className='text-sidebarBlue text-sm font-medium mb-5'>{comments.length} comments</div>
			{comments.map((comment:CommentFieldsFragment) =>
				<Comment
					comment={comment}
					key={comment.id}
					refetch={refetch}
				/>
			)}
		</div>
	);
};

export default Comments;
