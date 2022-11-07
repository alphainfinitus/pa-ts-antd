// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useState } from 'react';
import { usePostReactionsLazyQuery } from 'src/generated/graphql';
import { ReactionMapFields } from 'src/types';

import ReactionButton from './ReactionButton';
import { reactions } from './reactions';

interface Props {
	className?: string
	postId: number
}

const PostReactionBar = function ({ className, postId }: Props) {
	const [refetchNeeded, setRefetchNeeded] = useState(true);
	const [getMyStuff, { called, data, refetch }] = usePostReactionsLazyQuery({ variables: { postId } });

	useEffect(() => {
		if (refetchNeeded) {
			setRefetchNeeded(false);
			if (called) {
				refetch();
			} else {
				getMyStuff();
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetchNeeded, called]);
	const reactionMap: { [ key: string ]: ReactionMapFields; } = {};

	reactions.forEach((reaction) => {
		reactionMap[reaction] = {
			count: 0,
			userNames: []
		};
	});

	data?.post_reactions?.forEach(({ reaction, reacting_user }) => {
		if (!reactionMap[reaction]) {
			return;
		}

		if (reacting_user?.username && reactionMap[reaction].userNames.includes(reacting_user?.username)){
			console.error('This user has already reacted.');
			return;
		}

		if (reacting_user?.username) {
			reactionMap[reaction].userNames.push(reacting_user?.username);
		}

		reactionMap[reaction].count++;
	});

	return (
		<div className={`${className} flex items-center`}>
			{Object.keys(reactionMap).map((reaction) => {
				return (
					<ReactionButton
						key={reaction}
						reaction={reaction}
						reactionMap={reactionMap}
						postId={postId}
						setRefetchNeeded={setRefetchNeeded}
					/>
				);
			})}
		</div>
	);
};

export default PostReactionBar;
