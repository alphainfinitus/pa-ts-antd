// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable no-tabs */
import { SwapOutlined } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import { Dropdown, Menu } from 'antd';
import React, { useState } from 'react';
import { useDiscussionsCountQuery } from 'src/generated/graphql';
import { sortValues } from 'src/global/sortOptions';

import DiscussionListingWrapper from './DiscussionListingWrapper';

const DiscussionsContainer = ({ className } : { className?:string }) => {
	const [sortBy, setSortBy] = useState<string>(sortValues.COMMENTED);

	// TODO: Enable Refetch
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data: discussionsData, refetch: discussionsRefetch } = useDiscussionsCountQuery();

	const handleSortByClick = ({ key }: { key:string }) => {
		setSortBy(key);
	};

	const menu = (
		<Menu
			selectable
			onClick={handleSortByClick}
			defaultSelectedKeys={[sortValues.COMMENTED]}
			items={[
				{
					key: sortValues.COMMENTED,
					label: 'Last Commented'
				},
				{
					key: sortValues.NEWEST,
					label: 'Date Added (Newest)'
				},
				{
					key: sortValues.OLDEST,
					label: 'Date Added (Oldest)'
				}
			]}
		/>
	);

	const sortByDropdown = (<Dropdown overlay={menu} trigger={['click']}>
		<div className='dropdown-div flex items-center cursor-pointer hover:bg-pink_primary_transparent hover:text-white py-1 px-2 rounded'>
			<span className='mr-2'>Sort By</span>
			<SwapOutlined rotate={90} style={ { fontSize: '14px' } } />
		</div>
	</Dropdown>);

	return (
		<div className={`${className} shadow-md bg-white p-8`}>
			<div className='flex items-center justify-between'>
				<h1 className='dashboard-heading'>{ discussionsData?.posts_aggregate.aggregate?.count } Discussions</h1>
				{sortByDropdown}
			</div>

			<DiscussionListingWrapper sortBy={sortBy} className='mt-6' />
		</div>
	);
};

export default styled(DiscussionsContainer)`
	.ant-dropdown-trigger.ant-dropdown-open {
		color: #fff !important;
		background-color: pink_primary_transparent !important;
	}
`;