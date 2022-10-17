// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLatestDiscussionPostsQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import Address from 'src/ui-components/Address';
import { EmptyLatestActivity, ErrorLatestActivity, LoadingLatestActivity, PopulatedLatestActivity } from 'src/ui-components/LatestActivityStates';
import getDefaultAddressField from 'src/util/getDefaultAddressField';

interface DiscussionPostsRowData {
  key: string | number;
  title: string;
  address: string;
	username: string;
	createdAt: string | null;
	postId: number;
}

const columns: ColumnsType<DiscussionPostsRowData> = [
	{
		title: '#',
		dataIndex: 'postId',
		key: 'postId',
		width: 65,
		fixed: 'left'
	},
	{
		title: 'Title',
		dataIndex: 'title',
		key: 'title',
		width: 500,
		fixed: 'left'
	},
	{
		title: 'Posted By',
		dataIndex: 'username',
		key: 'postedBy',
		render: (username, rowData) => {
			return (
				!rowData.address ? <span className='username text-sidebarBlue'> { username } </span> :
					<Address
						address={rowData.address}
						className='text-sm'
						displayInline={true}
						disableIdenticon={true}
					/>
			);
		}
	},
	{
		title: 'Created',
		key: 'created',
		dataIndex: 'createdAt',
		render: (createdAt) => {
			const relativeCreatedAt = createdAt ? moment(createdAt).isAfter(moment().subtract(1, 'w')) ? moment(createdAt).startOf('day').fromNow() : moment(createdAt).format('Do MMM \'YY') : null;
			return (
				<span>{relativeCreatedAt}</span>
			);
		}
	}
];

const defaultAddressField = getDefaultAddressField();

const DiscussionPostsTable = () => {
	const navigate = useNavigate();

	// TODO: Enable refetch
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data, error, refetch } = useLatestDiscussionPostsQuery({
		variables: {
			limit: 10
		}
	});

	//error state
	if (error?.message) return <ErrorLatestActivity errorMessage={error?.message} />;

	if(data) {
		//empty state
		if(!data.posts || !data.posts.length) return <EmptyLatestActivity />;

		const tableData: DiscussionPostsRowData[] = [];

		data.posts.forEach(post => {
			if(post?.author?.username) {
				// truncate title
				let title = post.title || noTitle;
				title = title.length > 80 ? `${title.substring(0, Math.min(80, title.length))}...`  : title.substring(0, Math.min(80, title.length));

				const tableDataObj:DiscussionPostsRowData = {
					key: post.id,
					title,
					address: post.author[defaultAddressField]!,
					username: post.author.username,
					createdAt: post.created_at,
					postId: post.id
				};

				tableData.push(tableDataObj);
			}
		});

		return <PopulatedLatestActivity columns={columns} tableData={tableData} onClick={(rowData) => navigate(`/post/${rowData.postId}`)} />;
	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default DiscussionPostsTable;