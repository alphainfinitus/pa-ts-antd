// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LikeFilled, LikeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { useContext, useState } from 'react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useAddCommentReactionMutation, useAddPostReactionMutation, useDeleteCommentReactionMutation,useDeletePostReactionMutation } from 'src/generated/graphql';
import { ReactionMapFields } from 'src/types';

export interface ReactionButtonProps {
	className?: string
	reaction: string
	reactionMap:  { [ key: string ]: ReactionMapFields; }
	postId?: number
	commentId?: string
	setRefetchNeeded: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReactionButton = function ({
	className,
	reaction,
	reactionMap,
	postId,
	commentId,
	setRefetchNeeded
}: ReactionButtonProps) {
	const [reactionsDisabled, setReactionsDisabled] = useState<boolean>(false);

	const { id, username } = useContext(UserDetailsContext);
	const [addPostReactionMutation] = useAddPostReactionMutation();
	const [addCommentReactionMutation] = useAddCommentReactionMutation();
	const [deletePostReactionMutation] = useDeletePostReactionMutation();
	const [deleteCommentReactionMutation] = useDeleteCommentReactionMutation();
	const userNames = reactionMap[reaction].userNames;
	const reacted = username && userNames.includes(username);

	//returns string array of other-reactions by the user
	const otherReactions = () : string[] => {
		const otherReactions: string[] = [];

		if(!username) return otherReactions;

		for (const reactionKey of Object.keys(reactionMap)) {
			if(reactionMap[reactionKey].userNames.includes(username)){
				otherReactions.push(reactionKey);
			}
		}

		return otherReactions;
	};

	const refetchAndEnableReactions = () => {
		setRefetchNeeded(true);
		setReactionsDisabled(false);
	};

	const handleReact = () => {
		if (!id) {
			console.error('No user id found. Not logged in?');
			return;
		}

		setReactionsDisabled(true);

		if (postId) {
			if (reacted) {
				deletePostReactionMutation({
					variables: {
						postId,
						reaction,
						userId: id
					}
				})
					.then(refetchAndEnableReactions)
					.catch((e) => console.error('Error in reacting to content',e));
			} else {
				// check if user reacted to other-reactions
				const otherReactionsArr = otherReactions();
				if(otherReactionsArr.length > 0){
					//if reacted, delete that other-reactions
					const delReactionPromiseArr = otherReactionsArr.map((reactionToDel) => deletePostReactionMutation({
						variables: {
							postId,
							reaction: reactionToDel,
							userId: id
						}
					}));

					Promise.all(delReactionPromiseArr)
						.then(() => {
							setRefetchNeeded(true);
						})
						.catch((e) => console.error('Error in reacting to content', e));
				}

				//add new reaction
				addPostReactionMutation({
					variables: {
						postId,
						reaction,
						userId: id
					}
				})
					.then(refetchAndEnableReactions)
					.catch((e) => console.error('Error in reacting to content',e));
			}
		}

		if (commentId) {
			if (reacted) {
				deleteCommentReactionMutation({
					variables: {
						commentId,
						reaction,
						userId: id
					}
				})
					.then(refetchAndEnableReactions)
					.catch((e) => console.error('Error in reacting to content',e));
			} else {
				// check if user reacted to other-reaction option
				const otherReactionsArr = otherReactions();
				if(otherReactionsArr.length > 0){
					//if reacted, delete that other-reaction

					const delReactionPromiseArr = otherReactionsArr.map((reactionToDel) => deleteCommentReactionMutation({
						variables: {
							commentId,
							reaction: reactionToDel,
							userId: id
						}
					}));

					Promise.all(delReactionPromiseArr)
						.then(() => {
							setRefetchNeeded(true);
						})
						.catch((e) => console.error('Error in reacting to content', e));
				}

				//add new reaction
				addCommentReactionMutation({
					variables: {
						commentId,
						reaction,
						userId: id
					}
				})
					.then(refetchAndEnableReactions)
					.catch((e) => console.error('Error in reacting to content',e));
			}
		}
	};

	const getReactionIcon = (reaction: string, reacted: string | boolean | null | undefined) => {
		if(reaction == '👍') {
			return reacted ? <LikeFilled /> : <LikeOutlined />;
		}

		if(reaction == '👎') {
			return reacted ? <LikeFilled rotate={180} /> : <LikeOutlined rotate={180} />;
		}

		return reaction;
	};

	const button =  <span className={className}>
		<Button
			className={'border-none px-2 shadow-none disabled:opacity-[0.5] disabled:bg-transparent'}
			onClick={handleReact}
			disabled={!id || reactionsDisabled}
		>
			<span className="flex items-center text-pink_primary">
				{getReactionIcon(reaction, reacted)}
				<span className="ml-2 text-xs">
					{reactionMap[reaction].count}
				</span>
			</span>
		</Button>
	</span>;

	let popupContent = '';

	if (userNames.length > 10) {
		popupContent = `${userNames.slice(0, 10).join(', ')} and ${userNames.length - 10} others`;
	} else {
		popupContent = userNames.join(', ');
	}

	return userNames.length > 0 ?
		<Tooltip color='#E5007A' title={popupContent}>
			{button}
		</Tooltip> : button;
};

export default ReactionButton;
