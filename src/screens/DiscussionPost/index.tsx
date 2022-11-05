// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Post from '../../components/Post/Post';
import { useDiscussionPostAndCommentsLazyQuery } from '../../generated/graphql';
import FilteredError from '../../ui-components/FilteredError';
import Loader from '../../ui-components/Loader';

const DiscussionPost = ({ postID }: {postID?: number}) => {
	const param = useParams();
	const id = param.id as string;
	const idNumber = Number(id) || Number(postID) || 0;
	const [ refetch, { data, error } ] = useDiscussionPostAndCommentsLazyQuery({ variables: { 'id': idNumber } });

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (error?.message) return <FilteredError text={error.message}/>;

	if (data) return <Post data={data} refetch={refetch} />;

	return <Loader/>;
};

export default DiscussionPost;
