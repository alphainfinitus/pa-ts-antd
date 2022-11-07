// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLatestDiscussionPostsLazyQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import { PostCategory } from 'src/global/post_categories';
import { EmptyLatestActivity, ErrorLatestActivity, LoadingLatestActivity, PopulatedLatestActivity, PopulatedLatestActivityCard } from 'src/ui-components/LatestActivityStates';
import NameLabel from 'src/ui-components/NameLabel';
import getDefaultAddressField from 'src/util/getDefaultAddressField';
import getRelativeCreatedAt from 'src/util/getRelativeCreatedAt';

interface DiscussionPostsRowData {
  key: string | number;
  title: string;
  address: string;
	username: string;
	createdAt: string | null;
	postId: number;
	postCategory: PostCategory;
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
		title: 'Creator',
		dataIndex: 'username',
		key: 'creator',
		render: (username, { address }) => <NameLabel defaultAddress={address} username={username} disableIdenticon={true} />
	},
	{
		title: 'Created',
		key: 'created',
		dataIndex: 'createdAt',
		render: (createdAt) => {
			const relativeCreatedAt = getRelativeCreatedAt(createdAt);
			return (
				<span>{relativeCreatedAt}</span>
			);
		}
	}
];

const defaultAddressField = getDefaultAddressField();

const DiscussionPostsTable = () => {
	const navigate = useNavigate();

	const [refetch, { data, error }] = useLatestDiscussionPostsLazyQuery({
		variables: {
			limit: 8
		}
	});

	useEffect(() => {
		refetch();
	}, [refetch]);

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
					postId: post.id,
					postCategory: PostCategory.DISCUSSION
				};

				tableData.push(tableDataObj);
			}
		});

		return(<>
			<div className='hidden lg:block'>
				<PopulatedLatestActivity columns={columns} tableData={tableData} onClick={(rowData) => navigate(`/post/${rowData.postId}`)} />
			</div>

			<div className="block lg:hidden h-[520px] overflow-y-auto">
				<PopulatedLatestActivityCard tableData={tableData} onClick={(rowData) => navigate(`/post/${rowData.postId}`)} />
			</div>
		</>);
	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default DiscussionPostsTable;