// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button, Form, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUserDetailsContext } from 'src/context';
import queueNotification from 'src/ui-components/QueueNotification';

import { useChangeNotificationPreferenceMutation } from '../../generated/graphql';
import { handleTokenChange } from '../../services/auth.service';
import { NotificationStatus } from '../../types';
import FilteredError from '../../ui-components/FilteredError';

const NotificationSettings = () => {
	const currentUser = useUserDetailsContext();
	const [changed, setChanged] = useState<boolean>(false);
	const [postParticipated, setPostParticipated] = useState<boolean>(false);
	const [postCreated, setPostCreated] = useState<boolean>(false);
	const [newProposal, setNewProposal] = useState<boolean>(false);
	const [ownProposal, setOwnProposal] = useState<boolean>(false);
	const [changeNotificationPreferenceMutation, { error, loading }] = useChangeNotificationPreferenceMutation();
	const { notification, email_verified } = currentUser;

	useEffect(() => {
		setPostParticipated(notification?.postParticipated || false);
		setPostCreated(notification?.postCreated || false);
		setNewProposal(notification?.newProposal || false);
		setOwnProposal(notification?.ownProposal || false);
	}, [notification]);

	const updatePreference = () => {
		changeNotificationPreferenceMutation({
			variables: {
				newProposal,
				ownProposal,
				postCreated,
				postParticipated
			}
		})
			.then(({ data }) => {
				if (data && data.changeNotificationPreference && data.changeNotificationPreference.message) {
					queueNotification({
						header: 'Success!',
						message: data.changeNotificationPreference.message,
						status: NotificationStatus.SUCCESS
					});
					setChanged(false);
				}
				if (data?.changeNotificationPreference?.token) {
					handleTokenChange(data.changeNotificationPreference.token, currentUser);
				}
			}).catch((e) => {
				queueNotification({
					header: 'Failed!',
					message: e.message,
					status: NotificationStatus.ERROR
				});
				console.error('change name error', e);
			});
	};
	return (
		<Form onFinish={() => updatePreference()} className='w-full bg-white shadow-md p-8 rounded-md flex flex-col gap-y-8'>
			<header>
				<h3
					className='font-medium text-lg tracking-wide text-sidebarBlue'
				>
						Notification Settings
				</h3>
				<h5
					className='font-normal text-sm text-navBlue mt-2'
				>
						Update your notification settings. You will be receiving your notifications on <span className='text-sidebarBlue'>{currentUser?.email}</span>
				</h5>
			</header>
			{error?.message && <FilteredError text={error.message}/>}
			<article className='flex items-center gap-x-2'>
				<label
					className='text-sm text-sidebarBlue font-normal cursor-pointer'
					htmlFor='postParticipated'
				>
					Subscribe to post you participate in
				</label>
				<Switch
					checked={!!email_verified && postParticipated}
					disabled={!email_verified}
					onChange={(checked) => {
						setPostParticipated(checked);
						setChanged(true);
					}}
					size='small'
					id='postParticipated'
				/>
			</article>
			<article className='flex items-center gap-x-2'>
				<label
					className='text-sm text-sidebarBlue font-normal cursor-pointer'
					htmlFor='postCreated'
				>
					Subscribe to post you created
				</label>
				<Switch
					checked={!!email_verified && postCreated}
					disabled={!email_verified}
					onChange={(checked) => {
						setPostCreated(checked);
						setChanged(true);
					}}
					size='small'
					id='postCreated'
				/>
			</article>
			<article className='flex items-center gap-x-2'>
				<label
					className='text-sm text-sidebarBlue font-normal cursor-pointer'
					htmlFor='newProposal'
				>
					Notified for new proposal in council/motion/referendum
				</label>
				<Switch
					checked={!!email_verified && newProposal}
					disabled={!email_verified}
					onChange={(checked) => {
						setNewProposal(checked);
						setChanged(true);
					}}
					size='small'
					id='newProposal'
				/>
			</article>
			<article className='flex items-center gap-x-2'>
				<label
					className='text-sm text-sidebarBlue font-normal cursor-pointer'
					htmlFor='ownProposal'
				>
					Notified for your own proposals
				</label>
				<Switch
					checked={!!email_verified && ownProposal}
					disabled={!email_verified}
					onChange={(checked) => {
						setOwnProposal(checked);
						setChanged(true);
					}}
					size='small'
					id='ownProposal'
				/>
			</article>
			<article>
				<Button
					loading={loading}
					disabled={!changed}
					size='large'
					htmlType='submit'
					className={`rounded-lg font-semibold text-lg leading-7 text-white py-3 outline-none border-none px-14 flex items-center justify-center ${changed?'bg-pink_primary':'bg-icon_grey'}`}
				>
					Save
				</Button>
			</article>
		</Form>
	);
};

export default NotificationSettings;
