// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDiscussionPostAndCommentsLazyQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import Markdown from 'src/ui-components/Markdown';

import commentImg from '../../../assets/latest-activity-comment.png';

interface Props {
	className?: string
	id: number
	title?: string | null
	username?: string
	commentsCount?: number | null
	createdAt?: any
}

const DiscussionPostCard = ({ className, id, title, username, commentsCount, createdAt } : Props) => {

	const [ refetch, { data, error, loading } ] = useDiscussionPostAndCommentsLazyQuery({ variables: { 'id': id } });

	const relativeCreatedAt = createdAt ?
		moment(createdAt).isBefore(moment().subtract(1,'w')) ?
			moment(createdAt).format('DD-MM-YY') :
			moment(createdAt).startOf('day').fromNow() :
		null;

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<div className={`${className} bg-white drop-shadow-md p-3 lg:p-6 rounded-md`}>
			<h5>{title || noTitle}</h5>
			{ loading && <p>loading...</p>}
			{
				!loading && !error && data?.posts && data.posts.length > 0 && <Markdown md={`${(data.posts[0].content as string).split(' ').splice(0, 30).join(' ')}...` } />
			}

			<div className="">
				<div className="posted-by flex items-center mb-1">
					<span className="title mr-2 text-sidebarBlue">Posted by: </span>
					<span className="inline-block truncate">{username}</span>
				</div>

				<div className="flex items-center">
					<div className="comments flex items-center mr-3">
						<img className='mr-1' width='14px' height='14px' src={commentImg} alt="Comment" />
						{commentsCount}
					</div>
					<div className="">
						<ClockCircleOutlined className='align-middle mr-1' />
						{relativeCreatedAt}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DiscussionPostCard;
