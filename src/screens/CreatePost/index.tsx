// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button, Form, Input, Switch } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentForm from 'src/components/ContentForm';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useCreatePollMutation, useCreatePostMutation, usePostSubscribeMutation } from 'src/generated/graphql';
import { PostCategory } from 'src/global/post_categories';
import { usePollEndBlock } from 'src/hooks';
import { NotificationStatus } from 'src/types';
import BackToListingView from 'src/ui-components/BackToListingView';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import queueNotification from 'src/ui-components/QueueNotification';

import TopicsRadio from './TopicsRadio';

interface Props {
	className?: string
}

const CreatePost = ({ className } : Props) => {
	const navigate = useNavigate();
	const currentUser = useContext(UserDetailsContext);

	const [form] = Form.useForm();
	const pollEndBlock = usePollEndBlock();
	const [postSubscribeMutation] = usePostSubscribeMutation();
	const [createPollMutation] = useCreatePollMutation();
	const [createPostMutation, { loading, error }] = useCreatePostMutation();

	const [topicId, setTopicId] = useState<number>(1);
	const [hasPoll, setHasPoll] = useState<boolean>(false);
	const [formDisabled, setFormDisabled] = useState<boolean>(false);

	useEffect(() => {
		if (!currentUser?.id) {
			navigate('/');
		}
	}, [currentUser?.id, navigate]);

	const createSubscription = (postId: number) => {
		if (!currentUser.email_verified) {
			return;
		}

		if (!currentUser?.notification?.postCreated) {
			return;
		}

		postSubscribeMutation({
			variables: {
				postId
			}
		})
			.then(({ data }) => {
				if (data && data.postSubscribe && data.postSubscribe.message) {
					console.log(data.postSubscribe.message);
				}
			})
			.catch((e) => console.error('Error subscribing to post',e));
	};

	const createPoll = (postId: number) => {
		if (!hasPoll) {
			return;
		}

		if (!pollEndBlock) {
			queueNotification({
				header: 'Failed to get end block number. Poll creation failed!',
				message: 'Failed',
				status: NotificationStatus.ERROR
			});
			return;
		}

		createPollMutation({
			variables: {
				blockEnd: pollEndBlock,
				postId
			}
		})
			.catch((e) => console.error('Error creating a poll', e));
	};

	const handleSend = async () => {
		if(!currentUser.id) return;

		try {
			await form.validateFields();
			// Validation is successful
			const content = form.getFieldValue('content');
			const title = form.getFieldValue('title');

			console.log('content : ', content);
			console.log('title : ', title);

			if(!title || !content) return;

			setFormDisabled(true);
			createPostMutation({ variables: {
				content,
				title,
				topicId,
				userId: currentUser.id
			} }).then(({ data }) => {
				if (data?.insert_posts?.affected_rows && data?.insert_posts?.affected_rows > 0 && data?.insert_posts?.returning?.length && data?.insert_posts?.returning?.[0]?.id) {
					const postId = data?.insert_posts?.returning?.[0]?.id;
					navigate(`/post/${postId}`);
					queueNotification({
						header: 'Thanks for sharing!',
						message: 'Post created successfully.',
						status: NotificationStatus.SUCCESS
					});
					createSubscription(postId);
					createPoll(postId);
				} else {
					throw Error('Error in post creation');
				}
			}).catch( e => {
				queueNotification({
					header: 'Error',
					message: 'There was an error creating your post.',
					status: NotificationStatus.ERROR
				});
				console.error(e);
			});
		} catch {
		//do nothing, await form.validateFields(); will automatically highlight the error ridden fields
		} finally {
			setFormDisabled(false);
		}
	};

	return (
		<div className={className}>
			<BackToListingView postCategory={PostCategory.DISCUSSION} />

			<div className="flex flex-col mt-6 bg-white p-4 md:p-8 rounded-md w-full shadow-md mb-4">
				<h2 className="dashboard-heading mb-8">New Post</h2>
				{error && <ErrorAlert errorMsg={error.message} className='mb-4' />}

				<Form
					form={form}
					name="create-post-form"
					onFinish={handleSend}
					layout="vertical"
					disabled={formDisabled || loading}
					validateMessages= {
						{ required: "Please add the '${name}'" }
					}
				>
					<Form.Item name="title" label='Title' rules={[{ required: true }]}>
						<Input name='title' autoFocus placeholder='Enter Title' className='text-black' />
					</Form.Item>

					<ContentForm />

					<div className="flex items-center">
						<Switch size="small" onChange={checked => setHasPoll(checked)} />
						<span className='ml-2 text-sidebarBlue text-sm'>Add poll to discussion</span>
					</div>

					<div className='mt-8'>
						<div className="text-sidebarBlue text-sm mb-3">
							Select Topic
						</div>
						<TopicsRadio onTopicSelection={(id) => setTopicId(id)} />
					</div>

					<Form.Item>
						<Button htmlType="submit" disabled={!currentUser.id || formDisabled || loading} className='mt-16 bg-pink_primary text-white border-white hover:bg-pink_secondary flex items-center justify-center rounded-md text-lg h-[50px] w-[215px]'>
							Create Post
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default CreatePost;