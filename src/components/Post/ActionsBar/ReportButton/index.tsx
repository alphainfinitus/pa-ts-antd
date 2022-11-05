// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FlagOutlined } from '@ant-design/icons';
import { Button,Form,Input,Modal, Select } from 'antd';
import React, { useState } from 'react';
import { useReportContentMutation } from 'src/generated/graphql';
import { NotificationStatus } from 'src/types';
import ErrorAlert from 'src/ui-components/ErrorAlert';
import queueNotification from 'src/ui-components/QueueNotification';
import cleanError from 'src/util/cleanError';
import getNetwork from 'src/util/getNetwork';

interface DiscussionProps {
	type: string
	contentId: string
	className?: string
}

const reasons = [
	'It\'s suspicious or spam',
	'It\'s abusive or harmful',
	'It expresses intentions of self-harm or suicide',
	'other (please let us know in the field below)'
];

const reasonOptions = reasons.map(reason => (
	<Select.Option key={reason} value={reason}>{reason}</Select.Option>
));

const NETWORK = getNetwork();

const ReportButton = function ({ type, contentId, className }:DiscussionProps) {
	const [showModal, setShowModal] = useState(false);
	const [formDisabled, setFormDisabled] = useState<boolean>(false);
	const [reportContentMutation, { loading, error }] = useReportContentMutation();
	const [form] = Form.useForm();

	const handleReport = async () => {
		await form.validateFields();
		const error = form.getFieldError('reason');
		if(error.length > 0) return;
		setFormDisabled(true);
		const reason = form.getFieldValue('reason');
		const comments = form.getFieldValue('comments');

		reportContentMutation({
			variables: {
				comments,
				content_id: contentId,
				network: NETWORK,
				reason,
				type
			}
		})
			.then(({ data }) => {
				if (data && data.reportContent && data.reportContent.message) {
					queueNotification({
						header: 'Success!',
						message: data.reportContent.message,
						status: NotificationStatus.SUCCESS
					});
				}
				setShowModal(false);
				setFormDisabled(false);
			})
			.catch((e) => {
				console.error('Error reporting content',e);
				queueNotification({
					header: 'Error!',
					message: cleanError(e.message),
					status: NotificationStatus.ERROR
				});
				setFormDisabled(false);
			});
	};

	return (
		<>
			<Button className={`${ className } text-pink_primary flex items-center border-none shadow-none px-1.5 md:px-2`} onClick={() => setShowModal(true)}>
				<FlagOutlined /><span className='ml-1'>Report</span>
			</Button>

			<Modal
				title="Report Post"
				open={showModal}
				onOk={handleReport}
				confirmLoading={loading}
				onCancel={() => setShowModal(false)}
				footer={[
					<Button key="back" disabled={loading} onClick={() => setShowModal(false)}>
            Cancel
					</Button>,
					<Button htmlType='submit' key="submit" className='bg-pink_primary hover:bg-pink_secondary text-white' disabled={loading} onClick={handleReport}>
            Report
					</Button>
				]}
			>
				<Form
					form={form}
					name="report-post-form"
					onFinish={handleReport}
					layout="vertical"
					disabled={formDisabled}
					validateMessages={
						{ required: "Please add the '${name}'" }
					}
					initialValues={{
						comments: '',
						reason: reasons[0]
					}}
				>
					{error && <ErrorAlert errorMsg={error.message} className='mb-4' />}

					<Form.Item name='reason' label="Reason" rules={[{ required: true }]}>
						<Select>
							{reasonOptions}
						</Select>
					</Form.Item>
					<Form.Item
						name="comments"
						label="Comments (300 char max)"
					>
						<Input.TextArea name="comments" showCount rows={4} maxLength={300} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default ReportButton;
