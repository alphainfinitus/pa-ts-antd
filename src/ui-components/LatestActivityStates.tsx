// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FrownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Empty, Result } from 'antd';
import React, { ReactNode } from 'react';

const LatestActivityWrapper = ({ children }: {children: ReactNode}) => (
	<div className="h-[500px] flex items-center justify-center overflow-y-auto">
		{children}
	</div>
);

export const LoadingLatestActivity = () => {
	return (
		<LatestActivityWrapper>
			<Result
				icon={<LoadingOutlined />}
				title={'Loading...'}
			/>
		</LatestActivityWrapper>
	);
};

export const ErrorLatestActivity = ({ errorMessage } : { errorMessage: string}) => {
	return (
		<LatestActivityWrapper>
			<Result
				icon={<FrownOutlined />}
				title={errorMessage}
				extra={<Button type="primary" className='text-pink_primary hover:text-white' onClick={() => window.location.reload()}>Refresh</Button>}
			/>
		</LatestActivityWrapper>
	);
};

export const EmptyLatestActivity = () => {
	return (
		<LatestActivityWrapper>
			<Empty />
		</LatestActivityWrapper>
	);
};