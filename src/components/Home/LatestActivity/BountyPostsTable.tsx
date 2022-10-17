// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestBountyPostsQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import { post_type } from 'src/global/post_types';
import Address from 'src/ui-components/Address';
import { EmptyLatestActivity, ErrorLatestActivity, LoadingLatestActivity, PopulatedLatestActivity } from 'src/ui-components/LatestActivityStates';
import StatusTag from 'src/ui-components/StatusTag';

interface BountyPostsRowData {
  key: string | number;
  title: string;
  address?: string;
	username: string;
	status?: string;
	createdAt: string | null;
	onChainId?: string | number | null | undefined
}

const columns: ColumnsType<BountyPostsRowData> = [
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
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (status) => {
			if(status) return <StatusTag status={status} />;
		}
	}
];

const BountyPostsTable = () => {
	const navigate = useNavigate();

	// TODO: Enable refetch
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data, error, refetch } = useGetLatestBountyPostsQuery({
		variables: {
			limit: 10,
			postType: post_type.ON_CHAIN
		}
	});

	//error state
	if (error?.message) return <ErrorLatestActivity errorMessage={error?.message} />;

	if(data) {
		//empty state
		const atLeastOneCurrentBounty = data.posts.some((post) => {
			if (post.onchain_link?.onchain_bounty.length || post.onchain_link?.onchain_bounty_id) {
				// this breaks the loop as soon as
				// we find a post that has a bounty.
				return true;
			}
			return false;
		});

		if(!data.posts || !data.posts.length || !atLeastOneCurrentBounty) return <EmptyLatestActivity />;

		const tableData: BountyPostsRowData[] = [];

		data.posts.forEach(post => {
			if(post?.author?.username && (!!post.onchain_link?.onchain_bounty.length || post.onchain_link?.onchain_bounty_id)) {
				// truncate title
				let title = post.title || noTitle;
				title = title.length > 80 ? `${title.substring(0, Math.min(80, title.length))}...`  : title.substring(0, Math.min(80, title.length));

				const tableDataObj:BountyPostsRowData = {
					key: post.id,
					title,
					address: post.onchain_link.proposer_address,
					username: post.author.username,
					createdAt: post.created_at,
					status: post.onchain_link.onchain_bounty[0]?.bountyStatus?.[0].status,
					onChainId: post.onchain_link?.onchain_bounty_id
				};

				tableData.push(tableDataObj);
			}
		});

		return <PopulatedLatestActivity columns={columns} tableData={tableData} onClick={(rowData) => navigate(`/bounty/${rowData.onChainId}`)} />;
	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default BountyPostsTable;