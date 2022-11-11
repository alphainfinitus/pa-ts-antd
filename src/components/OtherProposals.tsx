// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ClockCircleOutlined } from '@ant-design/icons';
import { Collapse, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersProposalsLazyQuery } from 'src/generated/graphql';
import Address from 'src/ui-components/Address';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import { LoadingLatestActivity } from 'src/ui-components/LatestActivityStates';
import StatusTag from 'src/ui-components/StatusTag';
import { PostEmptyState } from 'src/ui-components/UIStates';
import getRelativeCreatedAt from 'src/util/getRelativeCreatedAt';

const { Panel } = Collapse;

interface Props {
	className?: string;
	proposerAddress: string;
	currPostOnchainID: number;
	closeSidebar: () => void;
}

interface PostsObj {
	proposalPosts: any[]
	treasuryPosts: any[]
}

const OtherProposals = ({ className, closeSidebar, currPostOnchainID, proposerAddress } : Props) => {
	const [postsObj, setPostsObj] = useState<PostsObj>({ proposalPosts:[], treasuryPosts:[] });

	const [refetch, { data, loading, error }] = useGetUsersProposalsLazyQuery({
		variables: {
			proposer_address: proposerAddress
		}
	});

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		if(loading || error || !data?.posts || data?.posts.length < 0) return;

		const posts:PostsObj = { proposalPosts:[], treasuryPosts:[] };

		data?.posts.forEach(post => {
			const onChainLinkID = post.onchain_link?.onchain_proposal_id ? post.onchain_link?.onchain_proposal_id : post.onchain_link?.onchain_treasury_proposal_id;

			//continue statement
			if(onChainLinkID == currPostOnchainID) {
				return;
			}

			if(post.onchain_link?.onchain_proposal_id) {
				posts.proposalPosts.push(post);
			} else {
				posts.treasuryPosts.push(post);
			}
		});

		setPostsObj(posts);
	}, [currPostOnchainID, data, error, loading]);

	return (
		<div className={className}>
			<h4 className="dashboard-heading flex items-center mb-6">
				Other Proposals by <span className='ml-2'><Address address={proposerAddress} displayInline shortenAddressLength={7}/></span>
			</h4>

			{!loading && error && <ErrorAlert className='mb-6' errorMsg={error.message} /> }

			{loading && <LoadingLatestActivity />}

			{!loading && !error && data?.posts && data?.posts.length > 1 &&
				<Space direction="vertical" className='w-full'>
					{postsObj.proposalPosts.length > 0 &&
						<Collapse collapsible="header" defaultActiveKey={['1']}>
							<Panel header="Democracy Proposals" key="1">
								{postsObj.proposalPosts.map(post => {
									const proposalType = post.onchain_link?.onchain_proposal_id ? 'proposal' : 'treasury';
									const onChainLinkID = proposalType == 'proposal' ? post.onchain_link?.onchain_proposal_id : post.onchain_link?.onchain_treasury_proposal_id;
									const status = proposalType == 'proposal' ? post.onchain_link?.onchain_proposal[0]?.proposalStatus?.[0].status : post.onchain_link?.onchain_treasury_spend_proposal[0]?.treasuryStatus?.[0].status;
									const toPath = proposalType == 'proposal' ? `/${proposalType}/${onChainLinkID}` : `/${proposalType}/${onChainLinkID}`;

									return <>
										{onChainLinkID != currPostOnchainID && <Link key={post.id} to={toPath} className='hover:text-sidebarBlue' onClick={closeSidebar}>
											<div className='my-4 border-2 border-grey_light hover:border-pink_primary hover:shadow-xl transition-all duration-200 rounded-md p-2 md:p-4'>
												<div className="flex justify-between">
													<div>
														<h5>{post.title || `#${onChainLinkID} Untitled`}</h5>
														<div className='flex items-center'> <ClockCircleOutlined className='mr-2' /> {getRelativeCreatedAt(post.created_at)}</div>
													</div>
													{status && <StatusTag className='statusTag' status={status} />}
												</div>
											</div>
										</Link>}
									</>;
								})}
							</Panel>
						</Collapse>
					}

					{postsObj.treasuryPosts.length > 0 &&
						<Collapse collapsible="header" defaultActiveKey={['1']}>
							<Panel header="Treasury Proposals" key="1">
								{postsObj.treasuryPosts.map(post => {
									const proposalType = post.onchain_link?.onchain_proposal_id ? 'proposal' : 'treasury';
									const onChainLinkID = proposalType == 'proposal' ? post.onchain_link?.onchain_proposal_id : post.onchain_link?.onchain_treasury_proposal_id;
									const status = proposalType == 'proposal' ? post.onchain_link?.onchain_proposal[0]?.proposalStatus?.[0].status : post.onchain_link?.onchain_treasury_spend_proposal[0]?.treasuryStatus?.[0].status;
									const toPath = proposalType == 'proposal' ? `/${proposalType}/${onChainLinkID}` : `/${proposalType}/${onChainLinkID}`;

									return <>
										{onChainLinkID != currPostOnchainID && <Link key={post.id} to={toPath} className='hover:text-sidebarBlue' onClick={closeSidebar}>
											<div className='my-4 border-2 border-grey_light hover:border-pink_primary hover:shadow-xl transition-all duration-200 rounded-md p-2 md:p-4'>
												<div className="flex justify-between">
													<div>
														<h5>{post.title || `#${onChainLinkID} Untitled`}</h5>
														<div className='flex items-center'> <ClockCircleOutlined className='mr-2' /> {getRelativeCreatedAt(post.created_at)}</div>
													</div>
													{status && <StatusTag className='statusTag' status={status} />}
												</div>
											</div>
										</Link>}
									</>;
								})}
							</Panel>
						</Collapse>
					}
				</Space>
			}

			{!loading && !error && data?.posts && data.posts.length <=1 &&
				<div className='flex justify-center items-center mt-36'>
					<PostEmptyState description='No other proposals found' />
				</div>
			}
		</div>
	);
};

export default OtherProposals;