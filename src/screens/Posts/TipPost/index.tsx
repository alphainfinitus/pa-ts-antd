// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from 'src/components/Post/Post';
import { useTipPostAndCommentsLazyQuery } from 'src/generated/graphql';
import { PostCategory } from 'src/global/post_categories';
import BackToListingView from 'src/ui-components/BackToListingView';
import { ErrorState, LoadingState } from 'src/ui-components/UIStates';

const TipPost = () => {
	const { hash } = useParams();
	const hashString = `${hash}`;

	const [refetch, { data, error }] = useTipPostAndCommentsLazyQuery({ variables: { 'hash': hashString } });
	useEffect(() => {
		refetch();
	}, [refetch]);
	if (error?.message) return <ErrorState errorMessage={error.message} />;

	if (data) return (<div>
		<BackToListingView postCategory={PostCategory.TIP} />

		<div className='mt-6'>
			<Post data={data} isTipProposal refetch={refetch} />
		</div>
	</div>);

	return <div className='mt-16'><LoadingState /></div>;
};

export default TipPost;
