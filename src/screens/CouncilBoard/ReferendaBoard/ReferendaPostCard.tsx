// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ClockCircleOutlined, DislikeOutlined,LikeOutlined } from '@ant-design/icons';
import moment from 'moment';
import React, { useContext, useEffect } from 'react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useGetLatestReferendaPostsWithVotesLazyQuery, useReferendumPostAndCommentsLazyQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import Markdown from 'src/ui-components/Markdown';
import StatusTag from 'src/ui-components/StatusTag';

interface Props {
	className?: string
	title?: string | null
	method: string | undefined
	postStatus: string | undefined
	createdAt?: any
	referendumId: number

	content?: string | null
	username?: string
	commentsCount?: number | null
}

const ReferendaPostCard = ({ className, createdAt, postStatus, referendumId, title, method } : Props) => {
	const { defaultAddress } = useContext(UserDetailsContext);

	const [ refetch, { data, error, loading } ] = useReferendumPostAndCommentsLazyQuery({ variables: { 'id': referendumId } });

	const [ , { data:voteData, loading:voteLoading, error:voteError } ] = useGetLatestReferendaPostsWithVotesLazyQuery({
		variables: {
			referendumId: referendumId,
			voter: `${defaultAddress}`
		}
	});

	useEffect(() => {
		refetch();
	},[refetch]);

	const relativeCreatedAt = createdAt ?
		moment(createdAt).isBefore(moment().subtract(1,'w')) ?
			moment(createdAt).format('DD-MM-YY') :
			moment(createdAt).startOf('day').fromNow() :
		null;

	return (
		<div className={`${className} bg-white drop-shadow-md p-3 lg:p-6 rounded-md`}>
			<div className="font-medium text-sm mb-[9px]">
				{!voteLoading && !voteError && voteData && voteData.referendumVotes.length > 0 &&
				<>
					{voteData.referendumVotes[0]?.vote.toLowerCase() === 'aye' ? <>
						<div className='inline-block text-center algin-middle w-[2.5rem] height-[2.5rem] text-[1.5rem] text-green_primary'>
							<LikeOutlined/>
						</div> Aye
					</> : <>
						<div className='inline-block text-center algin-middle w-[2.5rem] height-[2.5rem] text-[1.5rem] text-red_primary'>
							<DislikeOutlined/>
						</div> Nay
					</>}
				</>
				}
			</div>

			<h5>{title || method || noTitle}</h5>
			{ loading && <p>loading...</p>}
			{
				!loading && !error && data?.posts && data.posts.length > 0 && <Markdown md={`${(data.posts[0].content as string).split(' ').splice(0, 30).join(' ')}...` } />
			}

			<div className="flex justify-between items-center">
				<div className="referenda-post-status">
					{postStatus && <StatusTag className='post_tags' status={postStatus}/>}
				</div>

				<div className="">
					<span className="">
						<ClockCircleOutlined className='align-middle mr-1'/>
						{relativeCreatedAt}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ReferendaPostCard;
