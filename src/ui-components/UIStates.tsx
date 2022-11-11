// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { FrownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Empty, Result } from 'antd';
import React from 'react';
import nothingFound from 'src/assets/nothing-found.svg';
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

export const PostEmptyState = ({ className, description, postCategory } : { className?: string, postCategory?:PostCategory, description?: string }) => {
	return (
		<Empty
			className={className}
			image={nothingFound}
			description={
				postCategory?
					<span className='text-md text-navBlue'>
					We couldn&apos;t find any {postCategory} with this id.
					</span> : description ? <span className='text-md text-navBlue'>{description}</span> : <span className='text-md text-navBlue'>No data.</span>
			}
		/>
	);
};
