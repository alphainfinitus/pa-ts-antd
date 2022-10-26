// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { NotificationStatus } from 'src/types';
import queueNotification from 'src/ui-components/QueueNotification';

interface DiscussionProps {
	onchainId: string | number;
	isBounty?: boolean
	isMotion?: boolean
	isProposal?: boolean
	isReferendum?: boolean
	isTreasuryProposal?: boolean
	isTechCommitteeProposal?: boolean
	isTipProposal?: boolean
}

const TrackerButton = function ({
	onchainId,
	isBounty,
	isMotion,
	isProposal,
	isReferendum,
	isTreasuryProposal,
	isTechCommitteeProposal,
	isTipProposal
}:DiscussionProps) {
	const [tracked, setTracked] = useState(false);
	let postType = 'post';
	if (isBounty) {
		postType = 'bounty';
	}
	if (isMotion) {
		postType = 'motion';
	}
	if (isProposal) {
		postType = 'proposal';
	}
	if (isReferendum) {
		postType = 'referendum';
	}
	if (isTreasuryProposal) {
		postType = 'treasuryProposal';
	}
	if (isTechCommitteeProposal) {
		postType = 'techCommitteeProposal';
	}
	if (isTipProposal) {
		postType = 'tipProposal';
	}

	useEffect(() => {
		let trackMap: any = {};
		try {
			trackMap = JSON.parse(global.window.localStorage.getItem('trackMap') || '{}');
		} catch (error) {
			console.error(error);
		}

		if (trackMap[postType]?.[onchainId]) {
			setTracked(true);
		}
	}, [onchainId, postType]);

	const handleTrack = () => {
		let trackMap: any = {};
		try {
			trackMap = JSON.parse(global.window.localStorage.getItem('trackMap') || '{}');
		} catch (error) {
			console.error(error);
		}

		if (!trackMap[postType]) {
			trackMap[postType] = {};
		}

		if (tracked) {
			delete trackMap[postType][onchainId];
		} else {
			trackMap[postType][onchainId] = 1;
		}

		global.window.localStorage.setItem('trackMap', JSON.stringify(trackMap));

		queueNotification({
			header: 'Success!',
			message: `Post #${onchainId} ${tracked ? 'removed from' : 'added to'} personal tracker`,
			status: NotificationStatus.SUCCESS
		});

		setTracked(!tracked);
	};

	return (
		<Button
			className={'text-pink_primary flex items-center border-none shadow-none px-1 md:px-2'}
			onClick={handleTrack}
		>
			{tracked ? <EyeInvisibleOutlined /> : <EyeOutlined />}
			{tracked ? 'Untrack' : 'Track'}
		</Button>
	);
};

export default TrackerButton;
