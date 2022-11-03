// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CheckOutlined, CloseOutlined, DeleteOutlined, FormOutlined, LinkOutlined, LoadingOutlined } from '@ant-design/icons';
import { QueryLazyOptions } from '@apollo/client';
import styled from '@xstyled/styled-components';
import { Button, Form } from 'antd';
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ContentForm from 'src/components/ContentForm';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { CommentFieldsFragment, Exact,  useAddCommentReplyMutation,useDeleteCommentMutation, useEditCommentMutation } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import Markdown from 'src/ui-components/Markdown';
import queueNotification from 'src/ui-components/QueueNotification';
import copyToClipboard from 'src/util/copyToClipboard';
import getNetwork from 'src/util/getNetwork';

import CommentReactionBar from '../ActionsBar/Reactionbar/CommentReactionBar';
import ReportButton from '../ActionsBar/ReportButton';

interface Props {
	authorId: number,
	className?: string,
	comment: CommentFieldsFragment,
	commentId: string,
	content: string,
	created_at: Date,
	refetch: ((options?: QueryLazyOptions<Exact<{
		id: number;
	}>> | undefined) => void) | ((options?: QueryLazyOptions<Exact<{
		hash: string;
	}>> | undefined) => void)
}

const EditableCommentContent = ({ authorId, className, content, commentId, refetch }: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const { id } = useContext(UserDetailsContext);
	const toggleEdit = () => setIsEditing(!isEditing);
	const { pathname } = useLocation();

	const [form] = Form.useForm();
	form.setFieldValue('content', content || ''); //initialValues is not working

	const [replyForm] = Form.useForm();

	const [isReplying, setIsReplying] = useState(false);
	const toggleReply = () => setIsReplying(!isReplying);

	const handleCancel = () => {
		toggleEdit();
		form.setFieldValue('content', '');
	};

	const handleReplyCancel = () => {
		toggleReply();
		replyForm.setFieldValue('content', '');
	};

	const handleSave = async () => {
		await form.validateFields();
		const newContent = form.getFieldValue('content');
		if(!newContent) return;

		setIsEditing(false);
		editCommentMutation( {
			variables: {
				content: newContent,
				id: commentId
			} }
		)
			.then(({ data }) => {
				if (data?.update_comments && data.update_comments.affected_rows > 0){
					refetch();
					form.setFieldValue('content', '');
					queueNotification({
						header: 'Success!',
						message: 'Your comment was edited.',
						status: NotificationStatus.SUCCESS
					});
				}
			})
			.catch((e) => {
				queueNotification({
					header: 'Error!',
					message: 'There was an error in editing your comment.',
					status: NotificationStatus.ERROR
				});
				console.error('Error saving comment: ',e);
			});
	};

	const handleReplySave = async () => {
		await form.validateFields();
		const replyContent = replyForm.getFieldValue('content');
		if(!replyContent) return;

		if(id){
			setIsReplying(false);
			addCommentReplyMutation( {
				variables: {
					authorId: id,
					commentId: commentId,
					content: replyContent
				} }
			)
				.then(({ data }) => {
					if (data?.insert_replies && data?.insert_replies.affected_rows > 0){
						refetch();
						replyForm.setFieldValue('content', '');
						queueNotification({
							header: 'Success!',
							message: 'Your reply was added.',
							status: NotificationStatus.SUCCESS
						});
					}
				})
				.catch((e) => {
					console.error('Error saving comment: ',e);
					queueNotification({
						header: 'Error!',
						message: 'There was an error in saving your reply.',
						status: NotificationStatus.ERROR
					});
				});
		}
	};

	const copyLink = () => {
		const url = `https://${getNetwork()}.polkassembly.io${pathname}#${commentId}`;

		copyToClipboard(url);

		queueNotification({
			header: 'Copied!',
			message: 'Comment link copied to clipboard.',
			status: NotificationStatus.INFO
		});
	};

	const [editCommentMutation, { error, loading }] = useEditCommentMutation({
		variables: {
			content: '',
			id: commentId
		}
	});

	const [deleteCommentMutation] = useDeleteCommentMutation({
		variables: {
			id: commentId
		}
	});

	const deleteComment = () => {
		deleteCommentMutation( {
			variables: {
				id: commentId
			} }
		)
			.then(({ data }) => {
				if (data?.delete_comments?.affected_rows){
					refetch();
					queueNotification({
						header: 'Success!',
						message: 'Your comment was deleted.',
						status: NotificationStatus.SUCCESS
					});
				}
			})
			.catch((e) => {
				console.error('Error deleting comment: ', e);

				queueNotification({
					header: 'Error!',
					message: e.message,
					status: NotificationStatus.ERROR
				});
			});
	};

	const [addCommentReplyMutation, { error: errorReply, loading: loadingReply }] = useAddCommentReplyMutation({
		variables: {
			authorId: Number(id),
			commentId: commentId,
			content: ''
		}
	});

	// TODO: Implement
	// const relativeCreatedAt = created_at ? moment(created_at).isAfter(moment().subtract(1, 'w')) ? moment(created_at).startOf('day').fromNow(true) : moment(created_at).format('Do MMM \'YY') : null;

	return (
		<>
			<div className={className}>
				{error?.message && <div><ErrorAlert errorMsg={error.message} className='mb-4' /></div>}
				{
					isEditing
						?
						<Form
							form={form}
							name="comment-content-form"
							onFinish={handleSave}
							layout="vertical"
							disabled={loading}
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
										<CheckOutlined /> Submit
									</Button>
								</div>
							</Form.Item>
						</Form>
						:
						<>
							<Markdown md={content} className='py-2 px-4 bg-comment_bg rounded-b-md text-sm' />

							<div className='actions-bar flex items-start md:items-center flex-col md:flex-row bg-white'>
								<div className='flex items-center'>
									<CommentReactionBar className='reactions' commentId={commentId} />
									{
										id &&
										<Button className={ isReplying ? 'text-white bg-pink_primary text-xs' : 'text-pink_primary flex items-center border-none shadow-none text-xs' } onClick={toggleReply}>
											Reply
										</Button>
									}
									{id === authorId &&
										<Button className={'text-pink_primary flex items-center border-none shadow-none text-xs'} disabled={loading} onClick={toggleEdit}>
											{
												loading
													? <span className='flex items-center'><LoadingOutlined className='mr-2' /> Editing</span>
													: <span className='flex items-center'><FormOutlined className='mr-2' /> Edit</span>
											}
										</Button>
									}
								</div>
								<div className='flex items-center'>
									{id === authorId && <Button className={'text-pink_primary flex items-center border-none shadow-none text-xs'} onClick={deleteComment}><DeleteOutlined />Delete</Button>}
									{id && !isEditing && <ReportButton className='text-xs' type='comment' contentId={commentId} />}
									{<Button className={'text-pink_primary flex items-center border-none shadow-none text-xs'} onClick={copyLink}><LinkOutlined /> Copy link</Button>}
								</div>
							</div>

							{/* Add Reply Form*/}
							{errorReply?.message && <div>{errorReply.message}</div>}
							{
								isReplying && <Form
									form={replyForm}
									name="reply-content-form"
									onFinish={handleReplySave}
									layout="vertical"
									disabled={loadingReply}
									validateMessages= {
										{ required: "Please add the '${name}'" }
									}
									className='mt-4'
								>
									<ContentForm />
									<Form.Item>
										<div className='flex items-center justify-end'>
											<Button htmlType="button" disabled={ loadingReply } onClick={handleReplyCancel} className='mr-2 flex items-center'>
												<CloseOutlined /> Cancel
											</Button>
											<Button htmlType="submit" disabled={ loadingReply } className='bg-pink_primary text-white border-white hover:bg-pink_secondary flex items-center'>
												<CheckOutlined /> Reply
											</Button>
										</div>
									</Form.Item>
								</Form>
							}
						</>
				}
			</div>
		</>
	);
};

export default styled(EditableCommentContent)`

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

	.replyForm {
		margin-top: 2rem;
	}
`;
