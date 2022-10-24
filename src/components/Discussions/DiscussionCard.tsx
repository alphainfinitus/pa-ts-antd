// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ClockCircleOutlined, CommentOutlined } from '@ant-design/icons';
import { Divider, Space } from 'antd';
import moment from 'moment';
import React from 'react';
import Address from 'src/ui-components/Address';

export interface DiscussionProps {
  created_at: Date
  defaultAddress?: string | null
  comments?: string
  title: string
  username: string
}

const DiscussionCard = ({
	created_at,
	defaultAddress,
	comments,
	title,
	username
}:DiscussionProps) => {
	const relativeCreatedAt = created_at ? moment(created_at).isAfter(moment().subtract(1, 'w')) ? moment(created_at).startOf('day').fromNow() : moment(created_at).format('Do MMM \'YY') : null;

	return (
		<div className='border-2 border-grey_light hover:border-pink_primary hover:shadow-xl transition-all duration-200 rounded-md p-3 md:p-4'>
			<div className="flex">
				{/* Content */}
				<div className="content">
					<h1 className='text-sidebarBlue font-medium text-sm'>{title}</h1>
					<Space className="mt-3 font-medium text-navBlue text-xs flex flex-col md:flex-row items-start md:items-center">
						<Space className='flex'>
							by {defaultAddress ? <Address address={defaultAddress} displayInline={true} popupContent={username} /> : username}
						</Space>
						<Divider className='hidden md:inline-block' type="vertical" style={{ borderLeft: '1px solid #90A0B7' }} />

						<div className='flex items-center'>
							{relativeCreatedAt && <>
								<div className='flex items-center'>
									<ClockCircleOutlined className='mr-1' /> {relativeCreatedAt}
								</div><Divider type="vertical" style={{ borderLeft: '1px solid #90A0B7' }} />
							</>}

							{comments && <>
								<div className='flex items-center'>
									<CommentOutlined className='mr-1' /> {comments} comments
								</div>
							</>}
						</div>

					</Space>
				</div>
			</div>
		</div>
	);
};

export default DiscussionCard;