// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CheckOutlined, CloseOutlined, DeleteOutlined, FormOutlined, LoadingOutlined } from '@ant-design/icons';
import { QueryLazyOptions } from '@apollo/client';
import { Button, Form } from 'antd';
import React, { useContext, useState } from 'react';
import ContentForm from 'src/components/ContentForm';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { Exact, ReplyFieldsFragment,  useDeleteCommentReplyMutation,useEditCommentReplyMutation } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import Markdown from 'src/ui-components/Markdown';
import queueNotification from 'src/ui-components/QueueNotification';
import styled from 'styled-components';

import ReportButton from '../ActionsBar/ReportButton';

interface Props {
	authorId: number,
	className?: string,
	reply: ReplyFieldsFragment,
	commentId: string,
	content: string,
	replyId: string,
	refetch: ((options?: QueryLazyOptions<Exact<{
		id: number;
	}>> | undefined) => void) | ((options?: QueryLazyOptions<Exact<{
		hash: string;
	}>> | undefined) => void)
}

const EditableReplyContent = ({ authorId, className, commentId, content, replyId, refetch }: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const { id } = useContext(UserDetailsContext);
	const [newContent, setNewContent] = useState(content || '');
	const toggleEdit = () => setIsEditing(!isEditing);
	const [form] = Form.useForm();
	form.setFieldValue('content', content);

	const handleCancel = () => {
		toggleEdit();
		setNewContent(content || '');
	};

	const handleSave = () => {
		setIsEditing(false);
		editCommentReplyMutation( {
			variables: {
				content: newContent,
				id: replyId
			} }
		)
			.then(({ data }) => {
				if (data?.update_replies && data.update_replies.affected_rows > 0){
					refetch();
					queueNotification({
						header: 'Success!',
						message: 'Your reply was edited.',
						status: NotificationStatus.SUCCESS
					});
				}
			})
			.catch((e) => console.error('Error saving reply: ',e));
	};

	const [editCommentReplyMutation, { error, loading }] = useEditCommentReplyMutation({
		variables: {
			content: newContent,
			id: commentId
		}
	});

	const [deleteCommentReplyMutation] = useDeleteCommentReplyMutation({
		variables: {
			id: replyId
		}
	});

	const deleteReply = () => {
		deleteCommentReplyMutation( {
			variables: {
				id: replyId
			} }
		)
			.then(({ data }) => {
				if (data?.delete_replies && data.delete_replies.affected_rows > 0){
					refetch();
					queueNotification({
						header: 'Success!',
						message: 'Your reply was deleted.',
						status: NotificationStatus.SUCCESS
					});
				}
			})
			.catch((e) => {
				console.error('Error deleting reply: ', e);

				queueNotification({
					header: 'Error!',
					message: e.message,
					status: NotificationStatus.ERROR
				});
			});
	};

	return (
		<>
			<div className={className}>
				{error?.message && <div>{error.message}</div>}
				{
					isEditing
						?
						<Form
							form={form}
							name="reply-content-form"
							onFinish={handleSave}
							layout="vertical"
							// disabled={formDisabled}
							validateMessages= {
								{ required: "Please add the '${name}'" }
							}
						>
							<ContentForm />
							<Form.Item>
								<div className='flex items-center justify-end'>
									<Button htmlType="button" onClick={handleCancel} className='mr-2 flex items-center'>
										<CloseOutlined /> Cancel
									</Button>
									<Button htmlType="submit" className='bg-pink_primary text-white border-white hover:bg-pink_secondary flex items-center'>
										<CheckOutlined /> Reply
									</Button>
								</div>
							</Form.Item>
						</Form>
						:
						<>
							<Markdown md={content} />
							<div className='actions-bar'>
								{id === authorId &&
									<Button className={'text-pink_primary flex items-center border-none shadow-none'} disabled={loading} onClick={toggleEdit}>
										{
											loading
												? <span className='flex items-center'><LoadingOutlined className='mr-2' /> Editing</span>
												: <span className='flex items-center'><FormOutlined className='mr-2' /> Edit</span>
										}
									</Button>
								}
								{id === authorId && <Button className={'text-pink_primary flex items-center border-none shadow-none'} onClick={deleteReply}><DeleteOutlined />Delete</Button>}
								{id && !isEditing && <ReportButton type='comment' contentId={commentId + '#' + replyId} />}
							</div>
						</>
				}
			</div>
		</>
	);
};

export default styled(EditableReplyContent)`

	.button-container {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.actions-bar {
		display: flex;
		align-items: center;
	}

	.reactions {
		display: inline-flex;
		border: none;
		padding: 0.4rem 0;
		margin: 0rem;
	}

	.vl {
		display: inline-flex;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: grey_border;
		height: 2rem;
		margin: 0 1.2rem 0 0.8rem;
	}

	.replyForm {
		margin-top: 2rem;
	}

	.bg-blue-grey{
		background: #EBF0F5 !important;
	}
`;
