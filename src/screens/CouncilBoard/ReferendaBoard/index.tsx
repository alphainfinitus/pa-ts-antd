// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect } from 'react';
import { useAllReferendaPostsLazyQuery } from 'src/generated/graphql';
import { post_type } from 'src/global/post_types';

import ReferendaPostCard from './ReferendaPostCard';

interface Props {
	className?: string
	openSidebar: (postID: number) => void
}

const ReferendaBoard = ({ className, openSidebar } : Props) => {
	const [refetch, { data, error, loading }] = useAllReferendaPostsLazyQuery({
		variables: {
			limit: 10,
			postType: post_type.ON_CHAIN
		}
	});

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<div className={className}>
			<h3>Referenda {!loading && !error && data?.posts && <span className='card-count'>{data.posts.length}</span>}</h3>

			{
				!loading && !error && data?.posts &&
				<>
					{ data.posts.length > 0 ?
						data.posts.map(post => {
							return !!post?.author?.username &&
						<div key={post.id} className='post-card-div' onClick={() => openSidebar(Number(post.onchain_link?.onchain_referendum_id))}>
							<ReferendaPostCard
								title={post.title}
								method={post.onchain_link?.onchain_referendum[0]?.preimage?.method}
								postStatus={post.onchain_link?.onchain_referendum?.[0]?.referendumStatus?.[0].status}
								createdAt={post.created_at}
								referendumId={Number(post.onchain_link?.onchain_referendum_id)}
							/>
						</div>;
						})
						: <p>No Referenda found.</p>
					}
				</>
			}
		</div>
	);
};

export default styled(ReferendaBoard)``;