// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ClockCircleOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import React, { ReactNode } from 'react';
import getRelativeCreatedAt from 'src/util/getRelativeCreatedAt';

import InlineTag from './InlineTag';
import NameLabel from './NameLabel';

interface Props{
	className?: string
	children?: ReactNode
	created_at?: Date
	defaultAddress?: string | null
	text?: string
	topic?: string
	username?: string
	hideCreatedAt?: boolean
}

const CreationLabel = ({ className, children, created_at, defaultAddress, hideCreatedAt=false, text, username, topic } : Props) => {
	const relativeCreatedAt = getRelativeCreatedAt(created_at);

	return <div className={`${className} text-navBlue text-xs flex flex-col md:flex-row md:items-center`}>
		<div className='flex items-center'>
			{!text && <span className='mr-1'>By:</span>}
			<NameLabel
				defaultAddress={defaultAddress}
				username={username}
			/>
			{text}&nbsp;
			{topic &&
			<> in <InlineTag className='ml-2' topic={topic} /> </>
			}
		</div>

		<div className='flex items-center mt-1 md:mt-0'>
			{topic && <Divider className='ml-0 hidden md:inline-block' type="vertical" style={{ borderLeft: '1px solid #90A0B7' }} />}
			{!hideCreatedAt && created_at && <span className='flex items-center'><ClockCircleOutlined className='mr-1' />{relativeCreatedAt}</span>}
			{children}
		</div>
	</div>;
};

export default CreationLabel;
