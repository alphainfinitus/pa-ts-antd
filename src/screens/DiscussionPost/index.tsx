// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useParams } from 'react-router-dom';
import Post from 'src/components/Post/Post';
import { useDiscussionPostAndCommentsQuery } from 'src/generated/graphql';
import { ErrorState, LoadingState } from 'src/ui-components/UIStates';

const DiscussionPost = ({ postID }: {postID?: number}) => {
	const { id } = useParams();
	const idNumber = Number(id) || Number(postID) || 0;

	// TODO: Enable Refetch
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data, error, refetch } = useDiscussionPostAndCommentsQuery({ variables: { 'id': idNumber } });

	if (error?.message) return <ErrorState errorMessage={error.message} />;

	if (data) return <Post data={data} refetch={refetch} />;

	return <div className='mt-16'><LoadingState /></div>;

};

export default DiscussionPost;