// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Link } from 'react-router-dom';
import { LatestDiscussionPostsQuery } from 'src/generated/graphql';
import { LoadingState, PostEmptyState } from 'src/ui-components/UIStates';
import getDefaultAddressField from 'src/util/getDefaultAddressField';

import DiscussionCard from './DiscussionCard';

interface Props {
  className?: string
  data?: LatestDiscussionPostsQuery
	loading?: boolean
}
const defaultAddressField = getDefaultAddressField();

const DiscussionsListing = ({ className, data, loading } : Props) => {
	if(!data || loading) return <div className={className}><LoadingState /></div>;

	if (!data.posts || !data.posts.length) return <div className={className}><PostEmptyState /></div>;

	return (
		<ul className={className}>
			{!!data.posts &&
				data.posts.map(
					(post) => {
						return !!post?.author?.username &&
							<li key={post.id} className='my-5'>
								<Link to={`/post/${post.id}`}>
									<DiscussionCard
										defaultAddress={post.author[defaultAddressField]}
										comments={post.comments_aggregate.aggregate?.count
											? post.comments_aggregate.aggregate.count.toString()
											: 'no'}
										created_at={post.created_at}
										title={post.title || 'No title'}
										username={post.author.username}
									/>
								</Link>
							</li>
						;
					}
				)
			}
		</ul>
	);
};

export default DiscussionsListing;