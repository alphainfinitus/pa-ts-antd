// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AuditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { useCreateOptionPollMutation } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import queueNotification from 'src/ui-components/QueueNotification';

interface CreateOptionPollProps {
	postId: number
}

const daysOptions: React.ReactElement[] = [];
const hoursOptions: React.ReactElement[] = [];
const minutesOptions: React.ReactElement[] = [];

for (let i = 0; i < 59; i++) {
	if(i<10) {
		daysOptions.push(
			<Select.Option key={i + 1} value={i + 1}>{i + 1}</Select.Option>
		);
	}

	if(i<23) {
		hoursOptions.push(
			<Select.Option key={i + 1} value={i + 1}>{i + 1}</Select.Option>
		);
	}

	minutesOptions.push(
		<Select.Option key={i + 1} value={i + 1}>{i + 1}</Select.Option>
	);
}

const CreatePoll = function ({ postId }: CreateOptionPollProps) {
	const [showModal, setShowModal] = useState(false);
	const [formDisabled, setFormDisabled] = useState(false);
	const [form] = Form.useForm();

	const [createOptionPollMutation, { loading, error }] = useCreateOptionPollMutation();

	const handleCreate = async () => {
		try {
			await form.validateFields();
			// Validation is successful
			const question = form.getFieldValue('question');
			const options = form.getFieldValue('options');
			const days = form.getFieldValue('days') || 1;
			const hours = form.getFieldValue('hours') || 0;
			const minutes = form.getFieldValue('minutes') || 0;

			const endAt = Math.round(Date.now()/1000) + (days*24*60*60) + (hours*60*60) + (minutes*60);

			createOptionPollMutation({
				variables: {
					endAt,
					options: JSON.stringify(options),
					postId,
					question
				}
			})
				.then(({ data }) => {
					setShowModal(false);
					form.resetFields();
					if (data?.insert_option_poll?.affected_rows) {
						queueNotification({
							header: 'Success!',
							message: 'Poll Created',
							status: NotificationStatus.SUCCESS
						});
						window.location.reload();
					}
				})
				.catch((e) => {
					queueNotification({
						header: 'Error!',
						message: 'There was an error in creating the poll :(',
						status: NotificationStatus.ERROR
					});
					console.error('Error creating poll', e);
				});
		} catch (errors) {
			//do nothing, await form.validateFields(); will automatically highlight the error ridden fields
		} finally {
			setFormDisabled(false);
		}
	};

	return (
		<>
			<Button className={'text-pink_primary flex items-center border-none shadow-none px-1.5'} onClick={() => setShowModal(true)}>
				<AuditOutlined /><span className='ml-1'>Create Poll</span>
			</Button>

			<Modal
				title="Create Poll"
				open={showModal}
				onOk={handleCreate}
				onCancel={() => { form.resetFields(); setShowModal(false);}}
				confirmLoading={loading}
				footer={[
					<Button key="back" disabled={loading} onClick={() => { form.resetFields(); setShowModal(false);}}>
            Cancel
					</Button>,
					<Button htmlType='submit' key="submit" className='bg-pink_primary hover:bg-pink_secondary text-white' disabled={loading} onClick={handleCreate}>
            Create Poll
					</Button>
				]}
			>
				<Form
					form={form}
					name="report-post-form"
					onFinish={handleCreate}
					layout="vertical"
					disabled={loading || formDisabled}
					validateMessages={
						{ required: "Please add the '${name}'" }
					}
					initialValues={
						{ options: [undefined, undefined] }
					}
				>
					{error && <ErrorAlert errorMsg={error.message} className='mb-4' />}

					<Form.Item name="question" label="Question" rules={[{ required: true }]}>
						<Input name='question' autoFocus placeholder='Ask a question...' className='text-black' />
					</Form.Item>

					<Form.List
						name="options"
						rules={[
							{
								validator: async (_, options) => {
									if (!options || options.length < 2) {
										return Promise.reject(new Error('Please add atleast 2 options'));
									}
								}
							}
						]}
					>
						{(fields, { add, remove }, { errors }) => (
							<>
								{fields.map((field, index) => (
									<Form.Item
										label={index === 0 && 'Options'}
										required={false}
										key={field.key}
									>
										<Form.Item
											{...field}
											validateTrigger={['onChange', 'onBlur']}
											rules={[
												{
													message: 'Please input an option text or remove this field.',
													required: true,
													whitespace: true
												}
											]}
											noStyle
										>
											<Input placeholder={`Option ${index + 1}`} name='linkPostId' className='w-[90%] text-black' />
										</Form.Item>
										{fields.length > 2 ? (
											<MinusCircleOutlined
												className="ml-3"
												onClick={() => remove(field.name)}
											/>
										) : null}
									</Form.Item>
								))}

								<Form.Item>
									<Button
										type="dashed"
										onClick={() => add()}
										icon={<PlusOutlined />}
										className='flex items-center'
									>
										Add Option
									</Button>
									<Form.ErrorList errors={errors} />
								</Form.Item>
							</>
						)}
					</Form.List>

					<div className="flex items-center justify-between">
						<Form.Item
							name="days"
							label="Days"
							className='w-full mx-2'
						>
							<Select>
								{daysOptions}
							</Select>
						</Form.Item>

						<Form.Item
							name="hours"
							label="Hours"
							className='w-full mx-2'
						>
							<Select>
								{hoursOptions}
							</Select>
						</Form.Item>

						<Form.Item
							name="minutes"
							label="Minutes"
							className='w-full mx-2'
						>
							<Select>
								{minutesOptions}
							</Select>
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default CreatePoll;
