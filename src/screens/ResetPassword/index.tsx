// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { WarningOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row } from 'antd';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthForm from 'src/ui-components/AuthForm';
import queueNotification from 'src/ui-components/QueueNotification';
import messages from 'src/util/messages';
import * as validation from 'src/util/validation';

import { useResetPasswordMutation } from '../../generated/graphql';
import { NotificationStatus } from '../../types';
import FilteredError from '../../ui-components/FilteredError';

const ResetPassword = (): JSX.Element => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const token = searchParams.get('token')!;
	const userId = searchParams.get('userId')!;

	const [newPassword, setNewPassword ] = useState('');
	const [resetPassword, { loading, error }] = useResetPasswordMutation({
		variables: {
			newPassword,
			token,
			userId: Number(userId)
		}
	});

	const handleSubmitForm = (value: any) => {
		if (value.password){
			resetPassword({
				variables: {
					newPassword: value.password,
					token,
					userId: Number(userId)
				}
			}).then(({ data }) => {
				if (data && data.resetPassword && data.resetPassword.message) {
					queueNotification({
						header: 'Success!',
						message: data.resetPassword.message,
						status: NotificationStatus.SUCCESS
					});
					navigate('/login');
				}
			}).catch((e) => {
				console.error('Reset password error', e);
			});
		}
	};

	return (
		<Row justify='center' align='middle' className='h-full -mt-16'>
			{ <article className="bg-white shadow-md rounded-md p-8 flex flex-col gap-y-6 md:min-w-[500px]">
				{
					token && userId ? <>
						<h3 className='text-2xl font-semibold text-[#1E232C]'>Set new password</h3>
						<AuthForm
							onSubmit={handleSubmitForm}
							className="flex flex-col gap-y-6"
						>
							<div className="flex flex-col gap-y-1">
								<label
									htmlFor="password"
									className="text-base text-sidebarBlue font-medium"
								>
                            New Password
								</label>
								<Form.Item
									name="password"
									rules={
										[
											{
												message: messages.VALIDATION_PASSWORD_ERROR,
												min: validation.password.minLength
											},
											{
												message: messages.VALIDATION_PASSWORD_ERROR,
												required: validation.password.required
											}
										]
									}
								>
									<Input.Password
										onChange={(e) => setNewPassword(e.target.value)}
										placeholder="eg. password123"
										className="rounded-md py-3 px-4"
										id="password"
									/>
								</Form.Item>
							</div>
							<div className="flex justify-center items-center">
								<Button
									disabled={loading}
									htmlType="submit"
									size='large'
									className='bg-pink_primary w-56 rounded-md outline-none border-none text-white'
								>
						Set new password
								</Button>
							</div>
							{error?.message && <FilteredError text={error.message}/>}
						</AuthForm>
					</>: <h2 className='flex flex-col gap-y-2 items-center text-xl font-medium'>
						<WarningOutlined />
						<span>
                            Password reset token and/or userId missing
						</span>
					</h2>
				}
			</article>}
		</Row>
	);
};

export default ResetPassword;