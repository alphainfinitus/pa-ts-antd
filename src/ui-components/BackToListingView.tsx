// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LeftOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import { PostCategory } from 'src/global/post_categories';

const BackToListingView = ({ postCategory } : { postCategory:PostCategory }) => {
	let path: string = '';

	switch (postCategory){
	case PostCategory.DISCUSSION:
		path = 'discussions';
		break;
	case PostCategory.REFERENDA:
		path = 'referenda';
		break;
	case PostCategory.PROPOSAL:
		path = 'proposals';
		break;
	case PostCategory.MOTION:
		path = 'motions';
		break;
	case PostCategory.TREASURY_PROPOSAL:
		path = 'treasury-proposals';
		break;
	case PostCategory.TECH_COMMITTEE_PROPOSAL:
		path = 'tech-comm-proposals';
		break;
	case PostCategory.BOUNTY:
		path = 'bounties';
		break;
	case PostCategory.CHILD_BOUNTY:
		path = 'child_bounties';
		break;
	case PostCategory.TIP:
		path = 'tips';
		break;
	}

	const listingPageText = path.replace(/-|_/g, ' ');

	return (
		<Link className='text-sidebarBlue hover:text-pink_primary' to={`/${path}`}>
			<div className='flex items-center'>
				<LeftOutlined className='text-xs mr-2' />
				<span className='text-sm font-medium'>Back to <span className='capitalize'>{listingPageText}</span></span>
			</div>
		</Link>
	);
};

export default BackToListingView;