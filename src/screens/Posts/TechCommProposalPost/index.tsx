// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { useParams } from 'react-router-dom';
import Post from 'src/components/Post/Post';
import { useTechCommitteeProposalPostAndCommentsQuery } from 'src/generated/graphql';
import { PostCategory } from 'src/global/post_categories';
import BackToListingView from 'src/ui-components/BackToListingView';
import { ErrorState, LoadingState } from 'src/ui-components/UIStates';

const TechCommProposalPost = () => {
	const { id } = useParams();
	const idNumber = Number(id) || 0;

	const { data, error, refetch } = useTechCommitteeProposalPostAndCommentsQuery({ variables: { 'id': idNumber } });

	if (error?.message) return <ErrorState errorMessage={error.message} />;

	if (data) return (<div>
		<BackToListingView postCategory={PostCategory.TECH_COMMITTEE_PROPOSAL} />

		<div className='mt-6'>
			<Post data={data} isTechCommitteeProposal refetch={refetch} />
		</div>
	</div>);

	return <div className='mt-16'><LoadingState /></div>;
};

export default TechCommProposalPost;
