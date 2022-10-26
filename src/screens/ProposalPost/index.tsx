// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useParams } from 'react-router-dom';
import { PostCategory } from 'src/global/post_categories';
import BackToListingView from 'src/ui-components/BackToListingView';
import { ErrorState, LoadingState } from 'src/ui-components/UIStates';

import Post from '../../components/Post/Post';
import { useProposalPostAndCommentsQuery } from '../../generated/graphql';

const ProposalPost = () => {
	const { id } = useParams();
	const idNumber = Number(id) || 0;

	const { data, error, refetch } = useProposalPostAndCommentsQuery({ variables: { 'id': idNumber } });

	if (error?.message) return <ErrorState errorMessage={error.message} />;

	if (data) return (<div>
		<BackToListingView postCategory={PostCategory.PROPOSAL} />

		<div className='mt-6'>
			<Post data={data} isProposal refetch={refetch} />
		</div>
	</div>);

	return <div className='mt-16'><LoadingState /></div>;
};

export default ProposalPost;
