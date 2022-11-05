// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BookFilled, BookOutlined } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import { Button, Tooltip } from 'antd';
import React, { useContext,useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { usePostSubscribeMutation, usePostUnsubscribeMutation, useSubscriptionLazyQuery } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import queueNotification from 'src/ui-components/QueueNotification';
import cleanError from 'src/util/cleanError';

interface DiscussionProps {
	postId: number
}

const PopupContent = styled.span`
	font-size: 12px;
	color: black_primary;
	a {
		color: pink_primary;

		&:hover {
			text-decoration: none;
			color: pink_secondary;
		}
	}
`;
const SubscriptionButton = function ({
	postId
}:DiscussionProps) {

	const { email_verified } = useContext(UserDetailsContext);
	const [subscribed, setSubscribed] = useState(false);
	const [postSubscribeMutation] = usePostSubscribeMutation();
	const [postUnsubscribeMutation] = usePostUnsubscribeMutation();

	const [refetch, { data }]  = useSubscriptionLazyQuery({
		variables: { postId }
	});

	useEffect(() => {
		if (data && data.subscription && data.subscription.subscribed) {
			setSubscribed(data.subscription.subscribed);
		}
	},[data]);
	useEffect(() => {
		refetch();
	}, [refetch]);
	const handleSubscribe = () => {
		if (subscribed) {
			postUnsubscribeMutation({
				variables: {
					postId
				}
			})
				.then(({ data }) => {
					if (data && data.postUnsubscribe && data.postUnsubscribe.message) {
						queueNotification({
							header: 'Success!',
							message: data.postUnsubscribe.message,
							status: NotificationStatus.SUCCESS
						});
						setSubscribed(false);
					}
				})
				.catch((e) => {
					queueNotification({
						header: 'Failed!',
						message: cleanError(e.message),
						status: NotificationStatus.ERROR
					});
				});
		} else {
			postSubscribeMutation({
				variables: {
					postId
				}
			})
				.then(({ data }) => {
					if (data && data.postSubscribe && data.postSubscribe.message) {
						queueNotification({
							header: 'Success!',
							message: data.postSubscribe.message,
							status: NotificationStatus.SUCCESS
						});
						setSubscribed(true);
					}
				})
				.catch((e) => {
					queueNotification({
						header: 'Failed!',
						message: cleanError(e.message),
						status: NotificationStatus.ERROR
					});
				});
		}

	};

	const SubscribeButton = () => <Button
		className={`${subscribed && email_verified ? ' negative' : ''} text-pink_primary flex items-center border-none shadow-none disabled:opacity-[0.5] px-1.5 disabled:bg-transparent`}
		disabled={email_verified ? false : true}
		onClick={handleSubscribe}
	>
		{subscribed && email_verified ? <BookFilled /> : <BookOutlined />}
		{subscribed && email_verified ? 'Unsubscribe' : 'Subscribe'}
	</Button>;

	return email_verified
		?  <SubscribeButton />
		: <Tooltip color='#fff' title={<PopupContent>Set and verify an email <Link to="/settings">in your settings</Link> to be able to subscribe</PopupContent>}>
			<span><SubscribeButton/></span>
		</Tooltip>;

};

export default SubscriptionButton;
