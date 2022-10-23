// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CheckOutlined, CloseOutlined, LinkOutlined } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import { Alert, Button, Form, Input } from 'antd';
import { ApolloQueryResult } from 'apollo-client';
import React, { useState } from 'react';
import { DiscussionPostAndCommentsQuery, MotionPostAndCommentsQuery, ProposalPostAndCommentsQuery, ReferendumPostAndCommentsQuery, TipPostAndCommentsQuery, TreasuryProposalPostAndCommentsQuery, useEditPostMutation } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import queueNotification from 'src/ui-components/QueueNotification';

import ContentForm from '../ContentForm';

interface Props {
	className?: string;
	postId: number;
	title?: string | null;
	content?: string | null;
	toggleEdit: () => void;
	refetch: (variables?: any) => Promise<ApolloQueryResult<ReferendumPostAndCommentsQuery>>
		| Promise<ApolloQueryResult<ProposalPostAndCommentsQuery>>
		| Promise<ApolloQueryResult<MotionPostAndCommentsQuery>>
		| Promise<ApolloQueryResult<TipPostAndCommentsQuery>>
		| Promise<ApolloQueryResult<TreasuryProposalPostAndCommentsQuery>>
		| Promise<ApolloQueryResult<DiscussionPostAndCommentsQuery>>;
}

const PostContentForm = ({ className, postId, title, content, toggleEdit, refetch } : Props) => {
	const [formDisabled, setFormDisabled] = useState<boolean>(false);
	const [form] = Form.useForm();

	const [editPostMutation, { error }] = useEditPostMutation({
		variables: {
			content: content || '',
			id: postId,
			title: title || ''
		}
	});

	const onFinish = ({ title, content }: any) => {
		if(!title || !content) return;

		setFormDisabled(true);

		editPostMutation({
			variables: {
				content,
				id: postId,
				title
			} }
		).then(({ data }) => {
			if (data && data.update_posts && data.update_posts.affected_rows > 0){
				queueNotification({
					header: 'Success!',
					message: 'Your post was edited',
					status: NotificationStatus.SUCCESS
				});
				refetch();
				setFormDisabled(false);
				toggleEdit();
			}
		})
			.catch((e) => {
				console.error('Error saving post', e);
				queueNotification({
					header: 'Error!',
					message: 'Error in saving your post.',
					status: NotificationStatus.ERROR
				});
				setFormDisabled(false);
			});
	};

	return (
		<div className={className}>
			{error && <Alert message={error.message} type="error" className='mb-4' />}
			<Form
				form={form}
				name="post-content-form"
				onFinish={onFinish}
				layout="vertical"
				initialValues={{
					content,
					title
				}}
				disabled={formDisabled}
				validateMessages= {
					{ required: "Please add the '${name}'" }
				}
			>
				<Form.Item name="title" label="Title" rules={[{ required: true }]}>
					<Input autoFocus placeholder='Your title...' className='text-black' />
				</Form.Item>
				<ContentForm />
				<Form.Item>
					<div className='flex items-center justify-between'>
						<Button htmlType="button" className='mr-2 flex items-center'>
							<LinkOutlined /> Link Post
						</Button>

						<div className='flex items-center justify-end'>
							<Button htmlType="button" onClick={toggleEdit} className='mr-2 flex items-center'>
								<CloseOutlined /> Cancel
							</Button>
							<Button htmlType="submit" className='bg-pink_primary text-white border-white hover:bg-pink_secondary flex items-center'>
								<CheckOutlined /> Submit
							</Button>
						</div>
					</div>
				</Form.Item>
			</Form>
		</div>
	);
};

export default styled(PostContentForm)`
	.ant-form-item-explain-error {
		margin-top: 0.3em !important;
		margin-bottom: 1em !important;
	}
`;
