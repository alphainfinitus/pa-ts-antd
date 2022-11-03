// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Col, Divider, Row } from 'antd';
import React, { FC } from 'react';

import Account from './Account';
import Delete from './Delete';
import Profile from './Profile';

interface Props {}

const Settings: FC<Props> = () => {
	return (
		<Col className='w-full h-full'>
			<Row>
				<h3
					className='font-medium text-lg tracking-wide leading-7 text-sidebarBlue'
				>
					Settings
				</h3>
			</Row>
			<Row className='mt-6 w-full bg-white shadow-md p-8 rounded-md'>
				<Profile />
				<Divider />
				<Account />
				<Divider />
				<Delete />
			</Row>
		</Col>
	);
};

export default Settings;