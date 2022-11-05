// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Post from '../../components/Post/Post';
import { useReferendumPostAndCommentsLazyQuery } from '../../generated/graphql';
import FilteredError from '../../ui-components/FilteredError';
import Loader from '../../ui-components/Loader';

const ReferendumPost = ({ postID }: {postID?: number}) => {
	const params = useParams();
	const id = params.id;
	const idNumber = Number(id) || Number(postID) || 0;
	const [ refetch, { data, error } ] = useReferendumPostAndCommentsLazyQuery({ variables: { 'id': idNumber } });

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (error?.message) return <FilteredError text={error.message}/>;

	console.log('refe data',data);

	if (data) return <Post data={data} isReferendum refetch={refetch} />;

	return <Loader/>;
};

export default ReferendumPost;
