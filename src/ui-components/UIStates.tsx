// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { FrownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Empty, Result } from 'antd';
import React from 'react';
import { PostCategory } from 'src/global/post_categories';
import cleanError from 'src/util/cleanError';

export const LoadingState = () => {
	return (
		<Result
			icon={<LoadingOutlined />}
			title={'Loading...'}
		/>
	);
};

export const ErrorState = ({ errorMessage } : { errorMessage:string }) => {
	return (
		<Result
			icon={<FrownOutlined />}
			title={cleanError(errorMessage)}
			extra={<Button type="primary" className='text-pink_primary hover:text-white' onClick={() => window.location.reload()}>Refresh</Button>}
		/>
	);
};

export const PostEmptyState = ({ postCategory } : { postCategory:PostCategory }) => {
	return (
		<Empty
			description={
				<span className='text-xl'>
					We couldn&apos;t find any {postCategory} with this id.
				</span>
			}
		/>
	);
};
