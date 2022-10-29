// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { FrownOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<Result
			icon={<FrownOutlined />}
			title="Uh oh, it seems this route doesn&apos;t exist."
			extra={
				<Link to='/' className='py-2 px-6 bg-pink_primary text-white border-white hover:bg-pink_secondary rounded-md text-lg h-[50px] w-[215px]'>
					Go To Home
				</Link>
			}
		/>
	);
};

export default NotFound;