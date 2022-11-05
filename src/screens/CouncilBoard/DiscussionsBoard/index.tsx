// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
import { useDiscussionPostsIdDescLazyQuery } from 'src/generated/graphql';

import DiscussionPostCard from './DiscussionPostCard';

interface Props {
	className?: string
	openSidebar: (postID: number) => void
}

const DiscussionsBoard = ({ className, openSidebar } : Props) => {
	const [ refetch, { data, error, loading } ] = useDiscussionPostsIdDescLazyQuery({ variables: { limit: 10 } });

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<div className={className}>
			{!loading && error && <h3>Error fetching discussions</h3>}

			<h3>Discussions {!loading && !error && data?.posts && <span className='card-count'>{data.posts.length}</span>}</h3>
			{
				!loading && !error && data?.posts &&
				<>
					{ data.posts.length > 0 ?
						data.posts.map(post => {
							return !!post?.author?.username &&
						<div key={post.id} className='post-card-div' onClick={() => openSidebar(post.id)}>
							<DiscussionPostCard
								id={post.id}
								title={post.title}
								username={post.author.username}
								commentsCount={post.comments_aggregate.aggregate?.count}
								createdAt={post.created_at}
							/>
						</div>;
						})
						: <p>No Discussions found.</p>
					}
				</>
			}
		</div>
	);
};

export default styled(DiscussionsBoard)``;