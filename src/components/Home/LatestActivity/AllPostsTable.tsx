// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestPostsLazyQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import { PostCategory } from 'src/global/post_categories';
import { BountiesIcon, DemocracyProposalsIcon, DiscussionsIcon, MotionsIcon, ReferendaIcon, TipsIcon, TreasuryProposalsIcon } from 'src/ui-components/CustomIcons';
import { EmptyLatestActivity, ErrorLatestActivity, LoadingLatestActivity, PopulatedLatestActivity, PopulatedLatestActivityCard } from 'src/ui-components/LatestActivityStates';
import NameLabel from 'src/ui-components/NameLabel';
import StatusTag from 'src/ui-components/StatusTag';
import getDefaultAddressField from 'src/util/getDefaultAddressField';
import getRelativeCreatedAt from 'src/util/getRelativeCreatedAt';

interface AllPostsRowData {
  key: string | number;
  index: string | number;
  title: string;
	subTitle: string | null;
  address?: string;
	username: string;
  postCategory: PostCategory;
	icon: any;
	status: string;
	createdAt: string | null;
	onChainId: number;
}

interface PostTypeData {
	method: string
	onChainId: number
	postCategory: PostCategory
	status: string
	title: string
	index: string | number
	icon?: any
}

function getPostTypeData(post: any): PostTypeData | null {
	const postData: PostTypeData = {
		method: '',
		onChainId: 0,
		postCategory: PostCategory.PROPOSAL,
		status: '',
		title: post.title,
		index: '',
		icon: null
	};

	if (!post.onchain_link){
		//is discussion post
		postData.postCategory = PostCategory.DISCUSSION;
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
		postData.postCategory = PostCategory.BOUNTY;
		postData.method = '';
		postData.onChainId = post.onchain_link?.onchain_bounty_id;
		postData.status = post.onchain_link.onchain_bounty[0]?.bountyStatus?.[0].status;
		postData.index = post.onchain_link?.onchain_bounty_id;
		postData.icon = <BountiesIcon className='text-white text-lg' />;
		break;
	case 'onchain_motion_id':
		postData.postCategory = PostCategory.MOTION;
		postData.method = post.onchain_link.onchain_motion[0]?.preimage?.method;
		postData.onChainId = post.onchain_link?.onchain_motion_id;
		postData.status = post.onchain_link.onchain_motion[0]?.motionStatus?.[0].status;
		postData.index = post.onchain_link?.onchain_motion_id;
		postData.icon = <MotionsIcon className='text-white text-lg' />;
		break;
	case 'onchain_proposal_id':
		postData.postCategory = PostCategory.PROPOSAL;
		postData.method = post.onchain_link.onchain_proposal[0]?.preimage?.method;
		postData.onChainId = post.onchain_link?.onchain_proposal_id;
		postData.status = post.onchain_link.onchain_proposal[0]?.proposalStatus?.[0].status;
		postData.index = post.onchain_link?.onchain_proposal_id;
		postData.icon = <DemocracyProposalsIcon className='text-white text-lg' />;
		break;
	case 'onchain_referendum_id':
		postData.postCategory = PostCategory.REFERENDA;
		postData.method = post.onchain_link.onchain_referendum[0]?.preimage?.method;
		postData.onChainId = post.onchain_link?.onchain_referendum_id;
		postData.status = post.onchain_link.onchain_referendum[0]?.referendumStatus?.[0].status;
		postData.index = post.onchain_link?.onchain_referendum_id;
		postData.icon = <ReferendaIcon className='text-white text-lg' />;
		break;
	case 'onchain_tech_committee_proposal_id':
		postData.postCategory = PostCategory.TECH_COMMITTEE_PROPOSAL;
		postData.method = post.onchain_link.onchain_tech_committee_proposal[0]?.preimage?.method;
		postData.onChainId = post.onchain_link?.onchain_tech_committee_proposal_id;
		postData.status = post.onchain_link.onchain_tech_committee_proposal[0]?.status?.[0].status;
		postData.index = post.onchain_link?.onchain_tech_committee_proposal_id;
		postData.icon = <DemocracyProposalsIcon className='text-white text-lg' />;
		break;
	case 'onchain_treasury_proposal_id':
		postData.postCategory = PostCategory.TREASURY_PROPOSAL;
		postData.method = '';
		postData.onChainId = post.onchain_link?.onchain_treasury_proposal_id;
		postData.status = post.onchain_link.onchain_treasury_spend_proposal[0]?.treasuryStatus?.[0].status;
		postData.index = post.onchain_link?.onchain_treasury_proposal_id;
		postData.icon = <TreasuryProposalsIcon className='text-white text-lg' />;
		break;
	case 'onchain_tip_id':
		postData.postCategory = PostCategory.TIP;
		postData.method = '';
		postData.onChainId = post.onchain_link?.onchain_tip_id;
		postData.status = post.onchain_link.onchain_tip[0]?.tipStatus?.[0].status;
		postData.title = post.title ? post.title : post.onchain_link.onchain_tip?.[0]?.reason;
		postData.index = post.id;
		postData.icon = <TipsIcon className='text-white text-lg' />;
		break;
	case 'onchain_child_bounty_id':
		postData.postCategory = PostCategory.CHILD_BOUNTY;
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
		title: '#',
		dataIndex: 'index',
		key: 'index',
		width: 65,
		fixed: 'left'
	},
	{
		title: 'Title',
		dataIndex: 'title',
		key: 'title',
		width: 350,
		fixed: 'left',
		render: (title, { subTitle }) => {
			return (
				<>
					<h4>
						<div>
							{title}
						</div>
					</h4>
					{subTitle && <div className='text-sm text-sidebarBlue'>{subTitle}</div>}
				</>
			);
		}
	},
	{
		title: 'Posted By',
		dataIndex: 'username',
		key: 'postedBy',
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
	},
	{
		title: 'Type',
		dataIndex: 'postCategory',
		key: 'type',
		render: (postCategory, { icon }) => {
			return (
				<span className='flex items-center'>
					{icon} <span className='capitalize ml-3'>{postCategory}</span></span>
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

const AllPostsTable = () => {
	const navigate = useNavigate();

	function gotoPost(rowData: AllPostsRowData){
		let path: string = '';

		switch (rowData.postCategory){
		case PostCategory.DISCUSSION:
			path = 'post';
			break;
		case PostCategory.REFERENDA:
			path = 'referendum';
			break;
		case PostCategory.PROPOSAL:
			path = 'proposal';
			break;
		case PostCategory.MOTION:
			path = 'motion';
			break;
		case PostCategory.TREASURY_PROPOSAL:
			path = 'treasury';
			break;
		case PostCategory.TECH_COMMITTEE_PROPOSAL:
			path = 'tech';
			break;
		case PostCategory.BOUNTY:
			path = 'bounty';
			break;
		case PostCategory.CHILD_BOUNTY:
			path = 'child_bounty';
			break;
		case PostCategory.TIP:
			path = 'tip';
			break;
		}

		navigate(`/${path}/${rowData.onChainId}`);
	}

	const [refetch, { data, error }] = useGetLatestPostsLazyQuery({
		variables: {
			limit: 10
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

		const tableData: AllPostsRowData[] = [];

		data.posts.forEach(post => {
			const postTypeData = getPostTypeData(post);

			if(postTypeData && !!post?.author?.username) {
				// truncate title
				let title = postTypeData.title || postTypeData.method || noTitle;
				title = title.length > 80 ? `${title.substring(0, Math.min(80, title.length))}...`  : title.substring(0, Math.min(80, title.length));
				const subTitle = title && post.onchain_link?.onchain_tip?.[0]?.reason && postTypeData.method ? title : null;

				const tableDataObj:AllPostsRowData = {
					key: post.id,
					index: postTypeData.index,
					title,
					subTitle,
					address: postTypeData.postCategory === PostCategory.DISCUSSION ? post.author[defaultAddressField]! : post.onchain_link?.proposer_address!,
					username: post.author.username,
					createdAt: post.created_at,
					postCategory: postTypeData.postCategory,
					status: postTypeData.status,
					icon: postTypeData.icon,
					onChainId: postTypeData.onChainId
				};

				tableData.push(tableDataObj);
			}
		});

		return (
			<>
				<div className='hidden lg:block'>
					<PopulatedLatestActivity columns={columns} tableData={tableData} onClick={(rowData) => gotoPost(rowData)} />
				</div>

				<div className="block lg:hidden h-[520px] overflow-y-auto">
					<PopulatedLatestActivityCard tableData={tableData} onClick={(rowData) => gotoPost(rowData)} />
				</div>
			</>
		);
	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default AllPostsTable;