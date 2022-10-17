// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestDemocracyProposalPostsQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import { post_topic } from 'src/global/post_topics';
import { post_type } from 'src/global/post_types';
import Address from 'src/ui-components/Address';
import { EmptyLatestActivity, ErrorLatestActivity, LoadingLatestActivity, PopulatedLatestActivity } from 'src/ui-components/LatestActivityStates';
import StatusTag from 'src/ui-components/StatusTag';

interface ProposalPostsRowData {
  key: string | number;
  title: string;
  address?: string;
	username: string;
	status?: string;
	createdAt: string | null;
	onChainId?: string | number | null | undefined
}

const columns: ColumnsType<ProposalPostsRowData> = [
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

const ProposalPostsTable = () => {
	const navigate = useNavigate();

	// TODO: Enable refetch
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data, error, refetch } = useGetLatestDemocracyProposalPostsQuery({
		variables: {
			limit: 10,
			postTopic: post_topic.DEMOCRACY,
			postType: post_type.ON_CHAIN
		}
	});

	//error state
	if (error?.message) return <ErrorLatestActivity errorMessage={error?.message} />;

	if(data) {
		//empty state
		const atLeastOneCurrentProposal = data.posts.some((post) => {
			if (post.onchain_link?.onchain_proposal.length || post.onchain_link?.onchain_proposal_id) {
				// this breaks the loop as soon as
				// we find a post that has a proposal.
				return true;
			}
			return false;
		});

		if(!data.posts || !data.posts.length || !atLeastOneCurrentProposal) return <EmptyLatestActivity />;

		const tableData: ProposalPostsRowData[] = [];

		data.posts.forEach(post => {
			if(post?.author?.username && (!!post.onchain_link?.onchain_proposal.length || post.onchain_link?.onchain_proposal_id)) {
				// truncate title
				let title = post.title || post.onchain_link.onchain_proposal[0]?.preimage?.method || noTitle;
				title = title.length > 80 ? `${title.substring(0, Math.min(80, title.length))}...`  : title.substring(0, Math.min(80, title.length));

				const tableDataObj:ProposalPostsRowData = {
					key: post.id,
					title,
					address: post.onchain_link.proposer_address,
					username: post.author.username,
					createdAt: post.created_at,
					status: post.onchain_link.onchain_proposal[0]?.proposalStatus?.[0].status,
					onChainId: post.onchain_link?.onchain_proposal_id
				};

				tableData.push(tableDataObj);
			}
		});

		return <PopulatedLatestActivity columns={columns} tableData={tableData} onClick={(rowData) => navigate(`/proposal/${rowData.onChainId}`)} />;

	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default ProposalPostsTable;