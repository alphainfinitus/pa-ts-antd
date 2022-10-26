// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React from 'react';
import { noTitle } from 'src/global/noTitle';
import CreationLabel from 'src/ui-components/CreationLabel';
import Markdown from 'src/ui-components/Markdown';
import StatusTag from 'src/ui-components/StatusTag';
import UpdateLabel from 'src/ui-components/UpdateLabel';
import getDefaultAddressField from 'src/util/getDefaultAddressField';

import { DiscussionPostFragment, MotionPostFragment,ProposalPostFragment, ReferendumPostFragment, TreasuryProposalPostFragment } from '../../generated/graphql';
// import CreationLabel from '../../ui-components/CreationLabel';
// import UpdateLabel from '../../ui-components/UpdateLabel';

interface Props {
	className?: string,
	isTipProposal: boolean,
	onchainId?: string | number | null
	post: DiscussionPostFragment | ProposalPostFragment | ReferendumPostFragment| TreasuryProposalPostFragment| MotionPostFragment
	postStatus?: string
}
const PostContent = ({ className, isTipProposal, onchainId, post, postStatus }:Props) => {
	const { author, created_at, content, title, updated_at } = post;

	if (!author || !author.username || !content) return <div>Post not available</div>;

	const defaultAddressField = getDefaultAddressField();
	const defaultAddress = author[defaultAddressField];

	return (
		<div className={className}>
			{postStatus && <StatusTag className='mb-3' status={postStatus}/>}
			<h2 className='text-lg font-medium mb-1'>{(onchainId || onchainId === 0) && !isTipProposal && `#${onchainId}`} {title || noTitle}</h2>
			<div className='mb-8'>
				<>
					<CreationLabel
						className='md'
						created_at={created_at}
						defaultAddress={defaultAddress}
						username={author.username}
						topic={post.topic.name}
					>
						<UpdateLabel
							className='md'
							created_at={created_at}
							updated_at={updated_at}
						/>
					</CreationLabel>
				</>
			</div>
			<Markdown md={content} />
		</div>
	);
};

export default styled(PostContent)`
	position: relative;
	margin-bottom: 3rem;

	.post_info {
		display: inline-block;
		margin-bottom: 2rem;
	}
`;
