// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CheckOutlined } from '@ant-design/icons';
import { QueryLazyOptions } from '@apollo/client';
import { Button, Form } from 'antd';
import React, { useContext, useState } from 'react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import {  Exact, useAddPostCommentMutation, usePostSubscribeMutation } from 'src/generated/graphql';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import UserAvatar from 'src/ui-components/UserAvatar';
import styled from 'styled-components';

import ContentForm from '../ContentForm';

interface Props {
	className?: string
	postId: number
	refetch: ((options?: QueryLazyOptions<Exact<{
		id: number;
	}>> | undefined) => void) | ((options?: QueryLazyOptions<Exact<{
		hash: string;
	}>> | undefined) => void)
}

const commentKey = () => `comment:${global.window.location.href}`;

const PostCommentForm = ({ className, postId, refetch }: Props) => {
	const { id, notification, username } = useContext(UserDetailsContext);
	const [content, setContent] = useState('');
	const [form] = Form.useForm();

	const onContentChange = (content: string) => {
		setContent(content);
		global.window.localStorage.setItem(commentKey(), content);
		return content.length ? content : null;
	};

	const [addPostCommentMutation, { loading, error }] = useAddPostCommentMutation();
	const [postSubscribeMutation] = usePostSubscribeMutation();

	if (!id) return <div>You must log in to comment.</div>;

	const createSubscription = (postId: number) => {
		if (!notification?.postParticipated) {
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

	const handleSave = async () => {
		await form.validateFields();
		const content = form.getFieldValue('content');
		if(!content) return;

		addPostCommentMutation( {
			variables: {
				authorId: id,
				content,
				postId
			} }
		)
			.then(({ data }) => {
				if (data && data.insert_comments && data.insert_comments.affected_rows > 0) {
					setContent('');
					global.window.localStorage.removeItem(commentKey());
					refetch();
					createSubscription(postId);
				} else {
					throw new Error('No data returned from the saving comment query');
				}
			})
			.catch((e) => console.error('Error saving comment',e));
	};

	return (
		<div className={className}>
			{error?.message && <ErrorAlert errorMsg={error.message} className='mb-4' />}
			<UserAvatar
				className='mt-4 hidden md:inline-block'
				username={username || ''}
				size={'large'}
				id={id}
			/>

			<div className='comment-box bg-white p-[1rem]'>
				<Form
					form={form}
					name="comment-content-form"
					onFinish={handleSave}
					layout="vertical"
					initialValues={{
						content
					}}
					disabled={loading}
					validateMessages= {
						{ required: "Please add the '${name}'" }
					}
				>
					<ContentForm onChange={(content : any) => onContentChange(content)} height={300} />
					<Form.Item>
						<div className='flex items-center justify-end'>
							<Button htmlType="submit" className='bg-pink_primary text-white border-white hover:bg-pink_secondary flex items-center'>
								<CheckOutlined /> Comment
							</Button>
						</div>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default styled(PostCommentForm)`
	display: flex;
	margin: 2rem 0;

	.comment-box {
		width: calc(100% - 60px);

		@media only screen and (max-width: 768px) {
			width: calc(100%);
			padding: 0.5rem;
		}
	}

	.button-container {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}
`;
