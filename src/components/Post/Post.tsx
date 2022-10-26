// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

//TODO: REMOVE
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ApolloQueryResult } from 'apollo-client';
import React, { useContext, useEffect, useState } from 'react';
import { MetaContext } from 'src/context/MetaContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { BountyPostAndCommentsQuery, BountyPostAndCommentsQueryHookResult, BountyPostFragment, ChildBountyPostAndCommentsQuery, ChildBountyPostAndCommentsQueryHookResult, ChildBountyPostFragment, DiscussionPostAndCommentsQuery, DiscussionPostAndCommentsQueryHookResult, DiscussionPostFragment, MotionPostAndCommentsQuery, MotionPostAndCommentsQueryHookResult, MotionPostFragment, OnchainLinkBountyFragment, OnchainLinkChildBountyFragment, OnchainLinkMotionFragment, OnchainLinkProposalFragment, OnchainLinkReferendumFragment, OnchainLinkTechCommitteeProposalFragment, OnchainLinkTipFragment, OnchainLinkTreasuryProposalFragment, ProposalPostAndCommentsQuery, ProposalPostAndCommentsQueryHookResult, ProposalPostFragment, ReferendumPostAndCommentsQuery, ReferendumPostAndCommentsQueryHookResult, ReferendumPostFragment, TechCommitteeProposalPostAndCommentsQuery, TechCommitteeProposalPostAndCommentsQueryHookResult, TechCommitteeProposalPostFragment, TipPostAndCommentsQuery, TipPostAndCommentsQueryHookResult, TipPostFragment, TreasuryProposalPostAndCommentsQuery, TreasuryProposalPostAndCommentsQueryHookResult, TreasuryProposalPostFragment } from 'src/generated/graphql';
import { PostCategory } from 'src/global/post_categories';
import { PostEmptyState } from 'src/ui-components/UIStates';

import CreateOptionPoll from './ActionsBar/OptionPoll/CreateOptionPoll';
import PostReactionBar from './ActionsBar/Reactionbar/PostReactionBar';
import ReportButton from './ActionsBar/ReportButton';
import ShareButton from './ActionsBar/ShareButton';
import SubscriptionButton from './ActionsBar/SubscriptionButton/SubscriptionButton';
import TrackerButton from './ActionsBar/TrackerButton';
import Comments from './Comment/Comments';
import EditablePostContent from './EditablePostContent';

interface Props {
	className?: string
	data: (
		DiscussionPostAndCommentsQueryHookResult['data'] |
		ProposalPostAndCommentsQueryHookResult['data'] |
		ReferendumPostAndCommentsQueryHookResult['data'] |
		MotionPostAndCommentsQueryHookResult['data'] |
		TreasuryProposalPostAndCommentsQueryHookResult['data'] |
		TipPostAndCommentsQueryHookResult['data'] |
		BountyPostAndCommentsQueryHookResult['data'] |
		TechCommitteeProposalPostAndCommentsQueryHookResult['data'] |
		ChildBountyPostAndCommentsQueryHookResult['data']
	)
	isBounty?: boolean
	isMotion?: boolean
	isProposal?: boolean
	isReferendum?: boolean
	isTreasuryProposal?: boolean
	isTechCommitteeProposal?: boolean
	isTipProposal?: boolean
	isChildBounty?: boolean
	refetch: (variables?:any) =>
		Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<MotionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TipPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<BountyPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<TechCommitteeProposalPostAndCommentsQuery>> |
		Promise<ApolloQueryResult<ChildBountyPostAndCommentsQuery>>
}

interface Redirection {
	link?: string;
	text?: string;
}

const Post = ( { className, data, isBounty = false, isChildBounty = false, isMotion = false, isProposal = false, isReferendum = false, isTipProposal = false, isTreasuryProposal = false, isTechCommitteeProposal = false, refetch }: Props ) => {
	const post = data && data.posts && data.posts[0];
	const { id, addresses } = useContext(UserDetailsContext);
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing(!isEditing);
	const { setMetaContextState } = useContext(MetaContext);

	useEffect(() => {
		const users: string[] = [];

		if (post?.author?.username) {
			users.push(post?.author?.username);
		}

		post?.comments.forEach(c => {
			if (c.author?.username && !users.includes(c.author?.username)) {
				users.push(c.author?.username);
			}
		});
		global.window.localStorage.setItem('users', users.join(','));
	}, [post]);

	useEffect(() => {
		setMetaContextState((prevState) => {
			return {
				...prevState,
				description: post?.content || prevState.description,
				title: `${post?.title || 'Polkassembly' }`
			};
		});
	}, [post, setMetaContextState]);

	const isOnchainPost = isMotion || isProposal || isReferendum || isTreasuryProposal || isBounty || isTechCommitteeProposal || isTipProposal;

	let onchainId: string | number | null | undefined;
	let referendumPost: ReferendumPostFragment | undefined;
	let proposalPost: ProposalPostFragment | undefined;
	let motionPost: MotionPostFragment | undefined;
	let treasuryPost: TreasuryProposalPostFragment | undefined;
	let tipPost: TipPostFragment | undefined;
	let bountyPost: BountyPostFragment | undefined;
	let childBountyPost: ChildBountyPostFragment | undefined;
	let techCommitteeProposalPost: TechCommitteeProposalPostFragment | undefined;
	let definedOnchainLink: OnchainLinkTechCommitteeProposalFragment | OnchainLinkBountyFragment | OnchainLinkChildBountyFragment | OnchainLinkMotionFragment | OnchainLinkReferendumFragment | OnchainLinkProposalFragment | OnchainLinkTipFragment | OnchainLinkTreasuryProposalFragment | undefined;
	let postStatus: string | undefined;
	// TODO: Remove
	// eslint-disable-next-line prefer-const
	let redirection: Redirection = {};

	const isDiscussion = (post: TechCommitteeProposalPostFragment | BountyPostFragment | ChildBountyPostFragment | TipPostFragment | TreasuryProposalPostFragment | MotionPostFragment | ProposalPostFragment | DiscussionPostFragment | ReferendumPostFragment): post is DiscussionPostFragment => {
		if (!isTechCommitteeProposal && !isReferendum && !isProposal && !isMotion && !isTreasuryProposal && !isTipProposal && !isBounty && !isChildBounty) {
			return (post as DiscussionPostFragment) !== undefined;
		}

		return false;
	};

	if (!post) {
		const postCategory: PostCategory = isMotion ? PostCategory.MOTION : isProposal ? PostCategory.PROPOSAL : isReferendum ? PostCategory.REFERENDA : isTreasuryProposal ? PostCategory.TREASURY_PROPOSAL : isTipProposal ? PostCategory.TIP : isBounty ? PostCategory.TIP : isTechCommitteeProposal ? PostCategory.TECH_COMMITTEE_PROPOSAL : isChildBounty ? PostCategory.CHILD_BOUNTY : PostCategory.DISCUSSION;
		return <div className='mt-16'><PostEmptyState postCategory={postCategory} /></div>;
	}

	const isBountyProposer = isBounty && bountyPost?.onchain_link?.proposer_address && addresses?.includes(bountyPost.onchain_link.proposer_address);
	const isChildBountyProposer = isChildBounty && childBountyPost?.onchain_link?.proposer_address && addresses?.includes(childBountyPost.onchain_link.proposer_address);
	const isProposalProposer = isProposal && proposalPost?.onchain_link?.proposer_address && addresses?.includes(proposalPost.onchain_link.proposer_address);
	const isReferendumProposer = isReferendum && referendumPost?.onchain_link?.proposer_address && addresses?.includes(referendumPost.onchain_link.proposer_address);
	const isMotionProposer = isMotion && motionPost?.onchain_link?.proposer_address && addresses?.includes(motionPost.onchain_link.proposer_address);
	const isTreasuryProposer = isTreasuryProposal && treasuryPost?.onchain_link?.proposer_address && addresses?.includes(treasuryPost.onchain_link.proposer_address);
	const isTipProposer = isTipProposal && tipPost?.onchain_link?.proposer_address && addresses?.includes(tipPost.onchain_link.proposer_address);
	const isTechCommitteeProposalProposer = isTechCommitteeProposal && techCommitteeProposalPost?.onchain_link?.proposer_address && addresses?.includes(techCommitteeProposalPost.onchain_link.proposer_address);
	const canEdit = !isEditing && (
		post.author?.id === id ||
		isProposalProposer ||
		isReferendumProposer ||
		isMotionProposer ||
		isTreasuryProposer ||
		isTipProposer ||
		isBountyProposer ||
		isTechCommitteeProposalProposer ||
		isChildBountyProposer
	);

	const Sidebar = ({ className } : {className?:string}) => <>
		<div className={`${className} bg-white  md:drop-shadow-md md:p-6 rounded-md w-full lg:w-4/12 mx-auto`}>
			Sidebar Area
		</div>
	</>;

	return (
		<>
			<div className="flex flex-col lg:flex-row">
				{/* Post Content */}
				<div className='bg-white drop-shadow-md p-5 md:p-6 rounded-md w-full flex-1 lg:w-8/12 mx-auto lg:mr-9 mb-6 lg:mb-0'>
					<EditablePostContent
						isEditing={isEditing}
						isTipProposal={isTipProposal}
						onchainId={onchainId}
						post={post}
						postStatus={postStatus}
						refetch={refetch}
						toggleEdit={toggleEdit}
					/>

					{/* Actions Bar */}
					<div id='actions-bar' className="flex items-center flex-col md:flex-row mb-8">
						<div className='flex items-center'>
							<PostReactionBar className='reactions' postId={post.id} />
							{id && !isEditing && <SubscriptionButton postId={post.id}/>}
							{canEdit && <Button className={'text-pink_primary flex items-center border-none shadow-none'} onClick={toggleEdit}><FormOutlined />Edit</Button>}
						</div>
						<div className='flex items-center'>
							{id && !isEditing && !isOnchainPost && <ReportButton type='post' contentId={`${post.id}`} />}
							{canEdit && !isEditing && <CreateOptionPoll postId={post.id} />}
							{id && onchainId && isOnchainPost && !isEditing && (
								<TrackerButton
									onchainId={onchainId}
									isBounty={isBounty}
									isMotion={isMotion}
									isProposal={isProposal}
									isReferendum={isReferendum}
									isTipProposal={isTipProposal}
									isTreasuryProposal={isTreasuryProposal}
									isTechCommitteeProposal={isTechCommitteeProposal}
								/>)
							}
							<ShareButton title={post.title} />
						</div>
					</div>

					{!isEditing && <div className='flex lg:hidden mb-8'><Sidebar /></div>}

					{ !!post.comments?.length &&
						<Comments
							className='ml-0 md:ml-4'
							comments={post.comments}
							refetch={refetch}
						/>
					}
				</div>

				{!isEditing && <Sidebar className='hidden lg:block' />}

			</div>
		</>
	);
};

export default Post;