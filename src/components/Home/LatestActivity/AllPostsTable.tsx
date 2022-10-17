// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import styled from '@xstyled/styled-components';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestPostsQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import Address from 'src/ui-components/Address';
import { BountiesIcon, DemocracyProposalsIcon, DiscussionsIcon, MotionsIcon, ReferendaIcon, TipsIcon, TreasuryProposalsIcon } from 'src/ui-components/CustomIcons';
import { EmptyLatestActivity, ErrorLatestActivity, LoadingLatestActivity } from 'src/ui-components/LatestActivityStates';
import StatusTag from 'src/ui-components/StatusTag';
import getDefaultAddressField from 'src/util/getDefaultAddressField';

interface AllPostsRowData {
  key: string | number;
  index: string | number;
  title: string;
	subTitle: string | null;
  address?: string;
	username: string;
  postType: PostType;
	icon: any;
	status: string;
	createdAt: string | null;
	onChainId: number;
}

enum PostType {
	DISCUSSION = 'discussion',
	REFERENDA = 'referenda',
	PROPOSAL = 'proposal',
	MOTION = 'motion',
	TREASURY_PROPOSAL = 'treasury proposal',
	TECH_COMMITTEE_PROPOSAL = 'tech committee proposal',
	BOUNTY = 'bounty',
	CHILD_BOUNTY = 'child bounty',
	TIP = 'tip'
}

interface PostTypeData {
	method: string
	onChainId: number
	postType: PostType
	status: string
	title: string
	index: string | number
	icon?: any
}

function getPostTypeData(post: any): PostTypeData | null {
	const postData: PostTypeData = {
		method: '',
		onChainId: 0,
		postType: PostType.PROPOSAL,
		status: '',
		title: post.title,
		index: '',
		icon: null
	};

	if (!post.onchain_link){
		//is discussion post
		postData.postType = PostType.DISCUSSION;
		postData.onChainId = post.id;
		postData.index = post.id;
		postData.icon = <DiscussionsIcon className='text-white text-lg' />;
		return postData;
	}

	let postTypeKey: string = '';
	for (const key of Object.keys(post.onchain_link)) {
		if(/_id$/.test(key) && (post.onchain_link[key] !=null && post.onchain_link[key] != undefined)){
			postTypeKey = key;
			break;
		}
	}

	switch (postTypeKey){
	case 'onchain_bounty_id':
		postData.postType = PostType.BOUNTY;
		postData.method = '';
		postData.onChainId = post.onchain_link?.onchain_bounty_id;
		postData.status = post.onchain_link.onchain_bounty[0]?.bountyStatus?.[0].status;
		postData.index = post.onchain_link?.onchain_bounty_id;
		postData.icon = <BountiesIcon className='text-white text-lg' />;
		break;
	case 'onchain_motion_id':
		postData.postType = PostType.MOTION;
		postData.method = post.onchain_link.onchain_motion[0]?.preimage?.method;
		postData.onChainId = post.onchain_link?.onchain_motion_id;
		postData.status = post.onchain_link.onchain_motion[0]?.motionStatus?.[0].status;
		postData.index = post.onchain_link?.onchain_motion_id;
		postData.icon = <MotionsIcon className='text-white text-lg' />;
		break;
	case 'onchain_proposal_id':
		postData.postType = PostType.PROPOSAL;
		postData.method = post.onchain_link.onchain_proposal[0]?.preimage?.method;
		postData.onChainId = post.onchain_link?.onchain_proposal_id;
		postData.status = post.onchain_link.onchain_proposal[0]?.proposalStatus?.[0].status;
		postData.index = post.onchain_link?.onchain_proposal_id;
		postData.icon = <DemocracyProposalsIcon className='text-white text-lg' />;
		break;
	case 'onchain_referendum_id':
		postData.postType = PostType.REFERENDA;
		postData.method = post.onchain_link.onchain_referendum[0]?.preimage?.method;
		postData.onChainId = post.onchain_link?.onchain_referendum_id;
		postData.status = post.onchain_link.onchain_referendum[0]?.referendumStatus?.[0].status;
		postData.index = post.onchain_link?.onchain_referendum_id;
		postData.icon = <ReferendaIcon className='text-white text-lg' />;
		break;
	case 'onchain_tech_committee_proposal_id':
		postData.postType = PostType.TECH_COMMITTEE_PROPOSAL;
		postData.method = post.onchain_link.onchain_tech_committee_proposal[0]?.preimage?.method;
		postData.onChainId = post.onchain_link?.onchain_tech_committee_proposal_id;
		postData.status = post.onchain_link.onchain_tech_committee_proposal[0]?.status?.[0].status;
		postData.index = post.onchain_link?.onchain_tech_committee_proposal_id;
		postData.icon = <DemocracyProposalsIcon className='text-white text-lg' />;
		break;
	case 'onchain_treasury_proposal_id':
		postData.postType = PostType.TREASURY_PROPOSAL;
		postData.method = '';
		postData.onChainId = post.onchain_link?.onchain_treasury_proposal_id;
		postData.status = post.onchain_link.onchain_treasury_spend_proposal[0]?.treasuryStatus?.[0].status;
		postData.index = post.onchain_link?.onchain_treasury_proposal_id;
		postData.icon = <TreasuryProposalsIcon className='text-white text-lg' />;
		break;
	case 'onchain_tip_id':
		postData.postType = PostType.TIP;
		postData.method = '';
		postData.onChainId = post.onchain_link?.onchain_tip_id;
		postData.status = post.onchain_link.onchain_tip[0]?.tipStatus?.[0].status;
		postData.title = post.title ? post.title : post.onchain_link.onchain_tip?.[0]?.reason;
		postData.index = post.id;
		postData.icon = <TipsIcon className='text-white text-lg' />;
		break;
	case 'onchain_child_bounty_id':
		postData.postType = PostType.CHILD_BOUNTY;
		postData.method = '';
		postData.onChainId = post.onchain_link?.onchain_child_bounty_id;
		postData.status = post.onchain_link.onchain_child_bounty[0]?.childBountyStatus?.[0].status;
		postData.title = post.title ? post.title : post.onchain_link.onchain_child_bounty?.[0]?.description;
		postData.index = post.onchain_link?.onchain_child_bounty_id;
		postData.icon = <BountiesIcon className='text-white text-lg' />;
	}

	return postData;
}

const columns: ColumnsType<AllPostsRowData> = [
	{
		title: 'Index',
		dataIndex: 'index',
		key: 'index',
		width: 70,
		fixed: 'left'
	},
	{
		title: 'Title',
		dataIndex: 'title',
		key: 'title',
		width: 350,
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
		title: 'Created On',
		key: 'created_on',
		dataIndex: 'createdAt',
		render: (createdAt) => {
			const relativeCreatedAt = createdAt ? moment(createdAt).isAfter(moment().subtract(1, 'w')) ? moment(createdAt).startOf('day').fromNow() : moment(createdAt).format('Do MMM \'YY') : null;
			return (
				<span>{relativeCreatedAt}</span>
			);
		}
	},
	{
		title: 'Type',
		dataIndex: 'postType',
		key: 'type',
		render: (postType, rowData) => {
			return (
				<span className='flex items-center'>
					{rowData.icon} <span className='capitalize ml-3'>{postType}</span></span>
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

const defaultAddressField = getDefaultAddressField();

const AllPostsTable = ({ className }: {className?:string}) => {
	const navigate = useNavigate();

	function gotoPost(rowData: AllPostsRowData){
		let path: string = '';

		switch (rowData.postType){
		case PostType.DISCUSSION:
			path = 'post';
			break;
		case PostType.REFERENDA:
			path = 'referendum';
			break;
		case PostType.PROPOSAL:
			path = 'proposal';
			break;
		case PostType.MOTION:
			path = 'motion';
			break;
		case PostType.TREASURY_PROPOSAL:
			path = 'treasury';
			break;
		case PostType.TECH_COMMITTEE_PROPOSAL:
			path = 'tech';
			break;
		case PostType.BOUNTY:
			path = 'bounty';
			break;
		case PostType.CHILD_BOUNTY:
			path = 'child_bounty';
			break;
		case PostType.TIP:
			path = 'tip';
			break;
		}

		navigate(`/${path}/${rowData.onChainId}`);
	}

	// TODO: Enable refetch
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data, error, refetch } = useGetLatestPostsQuery({
		variables: {
			limit: 10
		}
	});

	//error state
	if (error?.message) return <ErrorLatestActivity errorMessage={error?.message} />;

	if(data) {
		//empty state
		if(!data.posts || !data.posts.length) return <EmptyLatestActivity />;

		const tableData: AllPostsRowData[] = [];

		data.posts.forEach(post => {
			const postTypeData = getPostTypeData(post);

			if(postTypeData && !!post?.author?.username) {
				// truncate title
				let title = postTypeData.title || postTypeData.method || noTitle;
				title = title.length > 80 ? `${title.substring(0, Math.min(80, title.length))}...`  : title.substring(0, Math.min(80, title.length));
				const subTitle = title && postTypeData.method ? title : null;

				const tableDataObj:AllPostsRowData = {
					key: post.id,
					index: postTypeData.index,
					title,
					subTitle,
					address: postTypeData.postType === PostType.DISCUSSION ? post.author[defaultAddressField]! : post.onchain_link?.proposer_address!,
					username: post.author.username,
					createdAt: post.created_at,
					postType: postTypeData.postType,
					status: postTypeData.status,
					icon: postTypeData.icon,
					onChainId: postTypeData.onChainId
				};

				tableData.push(tableDataObj);
			}
		});

		return <Table
			className={className}
			columns={columns}
			dataSource={tableData}
			pagination={false}
			scroll={{ x: 1000, y: 450 }}

			onRow={(rowData) => {
				return {
					onClick: () => gotoPost(rowData)
				};
			}}
		/>;
	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default styled(AllPostsTable)`
	td.ant-table-cell {
		color: nav_blue !important;
	}

	tr:nth-child(2n) td {
    background-color: #fbfbfb !important;
	}

	tr {
		cursor: pointer !important;
	}
`;