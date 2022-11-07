// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestDemocracyProposalPostsLazyQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import { PostCategory } from 'src/global/post_categories';
import { post_topic } from 'src/global/post_topics';
import { post_type } from 'src/global/post_types';
import { EmptyLatestActivity, ErrorLatestActivity, LoadingLatestActivity, PopulatedLatestActivity, PopulatedLatestActivityCard } from 'src/ui-components/LatestActivityStates';
import NameLabel from 'src/ui-components/NameLabel';
import StatusTag from 'src/ui-components/StatusTag';
import getRelativeCreatedAt from 'src/util/getRelativeCreatedAt';

interface ProposalPostsRowData {
  key: string | number;
  title: string;
  address?: string;
	username: string;
	status?: string;
	createdAt: string | null;
	onChainId?: string | number | null | undefined;
	postCategory: PostCategory;
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

const ProposalPostsTable = () => {
	const navigate = useNavigate();

	const [refetch, { data, error }] = useGetLatestDemocracyProposalPostsLazyQuery({
		variables: {
			limit: 8,
			postTopic: post_topic.DEMOCRACY,
			postType: post_type.ON_CHAIN
		}
	});
	useEffect(() => {
		refetch();
	}, [refetch]);
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
					onChainId: post.onchain_link?.onchain_proposal_id,
					postCategory: PostCategory.PROPOSAL
				};

				tableData.push(tableDataObj);
			}
		});

		return(<>
			<div className='hidden lg:block'>
				<PopulatedLatestActivity columns={columns} tableData={tableData} onClick={(rowData) => navigate(`/proposal/${rowData.onChainId}`)} />
			</div>

			<div className="block lg:hidden h-[520px] overflow-y-auto">
				<PopulatedLatestActivityCard tableData={tableData} onClick={(rowData) => navigate(`/proposal/${rowData.onChainId}`)} />
			</div>
		</>);

	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default ProposalPostsTable;