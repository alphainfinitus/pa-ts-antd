// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestMotionPostsLazyQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import { PostCategory } from 'src/global/post_categories';
import { post_type } from 'src/global/post_types';
import { EmptyLatestActivity, ErrorLatestActivity, LoadingLatestActivity, PopulatedLatestActivity, PopulatedLatestActivityCard } from 'src/ui-components/LatestActivityStates';
import NameLabel from 'src/ui-components/NameLabel';
import StatusTag from 'src/ui-components/StatusTag';
import getRelativeCreatedAt from 'src/util/getRelativeCreatedAt';

interface MotionPostsRowData {
  key: string | number;
  title: string;
  address?: string;
	username: string;
	status?: string;
	createdAt: string | null;
	onChainId?: string | number | null | undefined
	postCategory: PostCategory
}

const columns: ColumnsType<MotionPostsRowData> = [
	{
		title: '#',
		dataIndex: 'onChainId',
		key: 'index',
		width: 65,
		fixed: 'left'
	},
	{
		title: 'Title',
		dataIndex: 'title',
		key: 'title',
		width: 420,
		fixed: 'left'
	},
	{
		title: 'Creator',
		dataIndex: 'username',
		key: 'creator',
		render: (username, { address }) => <NameLabel defaultAddress={address} username={username} disableIdenticon={true} />
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (status) => {
			if(status) return <StatusTag status={status} />;
		}
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

const MotionPostsTable = () => {
	const navigate = useNavigate();

	const [refetch, { data, error }] = useGetLatestMotionPostsLazyQuery({ variables: { limit: 8, postType: post_type.ON_CHAIN } });
	useEffect(() => {
		refetch();
	}, [refetch]);
	//error state
	if (error?.message) return <ErrorLatestActivity errorMessage={error?.message} />;

	if(data) {
		//empty state
		const atLeastOneCurrentMotion = data.posts.some((post) => {
			if (post.onchain_link?.onchain_motion.length || post.onchain_link?.onchain_motion_id) {
				// this breaks the loop as soon as
				// we find a post that has a motion.
				return true;
			}
			return false;
		});

		if(!data.posts || !data.posts.length || !atLeastOneCurrentMotion) return <EmptyLatestActivity />;

		const tableData: MotionPostsRowData[] = [];

		data.posts.forEach(post => {
			if(post?.author?.username && (!!post.onchain_link?.onchain_motion.length || post.onchain_link?.onchain_motion_id)) {
				// truncate title
				let title = post.title || post.onchain_link.onchain_motion[0]?.preimage?.method || noTitle;
				title = title.length > 80 ? `${title.substring(0, Math.min(80, title.length))}...`  : title.substring(0, Math.min(80, title.length));

				const tableDataObj:MotionPostsRowData = {
					key: post.id,
					title,
					address: post.onchain_link.proposer_address,
					username: post.author.username,
					createdAt: post.created_at,
					status: post.onchain_link.onchain_motion[0]?.motionStatus?.[0].status,
					onChainId: post.onchain_link?.onchain_motion_id,
					postCategory: PostCategory.MOTION
				};

				tableData.push(tableDataObj);
			}
		});

		return(<>
			<div className='hidden lg:block'>
				<PopulatedLatestActivity columns={columns} tableData={tableData} onClick={(rowData) => navigate(`/motion/${rowData.onChainId}`)} />
			</div>

			<div className="block lg:hidden h-[520px] overflow-y-auto">
				<PopulatedLatestActivityCard tableData={tableData} onClick={(rowData) => navigate(`/motion/${rowData.onChainId}`)} />
			</div>
		</>);
	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default MotionPostsTable;