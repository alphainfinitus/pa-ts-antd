// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LinkOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import React, { useState } from 'react';
import { useDiscussionPostAndCommentsLazyQuery } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import queueNotification from 'src/ui-components/QueueNotification';
import cleanError from 'src/util/cleanError';

interface Props {
	className?: string
	setNewTitle: (title: string) => void
	setNewContent: (content: string) => void
}

const LinkPostModal = ({ className, setNewTitle, setNewContent } : Props) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [formDisabled, setFormDisabled] = useState<boolean>(false);
	const [form] = Form.useForm();

	const [discussionPostQuery, { data, loading }] = useDiscussionPostAndCommentsLazyQuery();

	const handleSubmit = async () => {
		// TODO: validate: match discussion post and onchain post author match;
		const linkPostId = form.getFieldValue('linkPostId');
		const error = form.getFieldError('linkPostId');
		if(error.length > 0 || isNaN(Number(linkPostId))) return;
		await form.validateFields();
		setFormDisabled(true);

		try {
			discussionPostQuery({ variables: { id: Number(linkPostId) } });

			if (data && data.posts && data.posts.length) {
				if (data.posts[0].title) {
					setNewTitle(data.posts[0].title);
				}
				if (data.posts[0].content) {
					setNewContent(data.posts[0].content);
				}
			}

			setFormDisabled(false);
			setShowModal(false);
		} catch (error) {
			queueNotification({
				header: 'Error!',
				message: cleanError(error.message),
				status: NotificationStatus.ERROR
			});

			setFormDisabled(false);
			setShowModal(false);
		}

	};

	return (
		<>
			<Button htmlType="button" className={className} onClick={() => setShowModal(true)}>
				<LinkOutlined /> Link Post
			</Button>

			<Modal
				title="Post ID to Link"
				open={showModal}
				onOk={handleSubmit}
				confirmLoading={loading}
				onCancel={() => setShowModal(false)}
				footer={[
					<Button key="back" disabled={loading} onClick={() => setShowModal(false)}>
            Cancel
					</Button>,
					<Button htmlType='submit' key="submit" type="primary" disabled={loading} onClick={handleSubmit}>
            Link
					</Button>
				]}
			>
				<Form
					form={form}
					name="post-content-form"
					onFinish={handleSubmit}
					layout="vertical"
					disabled={formDisabled}
					validateMessages= {
						{ required: "Please add a valid '${name}' number" }
					}
				>
					<Form.Item name="linkPostId" rules={[{ required: true }]}>
						<Input name='linkPostId' autoFocus placeholder='Post ID' className='text-black' type='number' />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default LinkPostModal;