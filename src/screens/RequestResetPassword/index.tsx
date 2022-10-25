// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button,Form ,Input, Row } from 'antd';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModalContext } from 'src/context';
import AuthForm from 'src/ui-components/AuthForm';
import messages from 'src/util/messages';
import * as validation from 'src/util/validation';

import { useRequestResetPasswordMutation } from '../../generated/graphql';
import FilteredError from '../../ui-components/FilteredError';

interface Props {}

const RequestResetPassword: FC<Props> = () => {
	const navigate = useNavigate();
	const { setModal } = useModalContext();
	const [requestResetPasswordMutation, { loading, error }] =
    useRequestResetPasswordMutation();

	const handleSubmitForm = (data: any): void => {
		const { email } = data;
		if (email) {
			requestResetPasswordMutation({
				variables: {
					email
				}
			})
				.then(({ data }) => {
					if (
						data &&
            data.requestResetPassword &&
            data.requestResetPassword.message
					) {
						navigate('/');
						console.log(data.requestResetPassword.message);
						setModal({
							content: data.requestResetPassword.message,
							title: 'Check your emails'
						});
					}
				})
				.catch((e) => {
					console.error('Request password reset error', e);
				});
		}
	};

	return (
		<Row justify='center' align='middle' className='h-full -mt-16'>
			<article className="bg-white shadow-md rounded-md p-8 flex flex-col gap-y-6 md:min-w-[500px]">
				<h3 className='text-2xl font-semibold text-[#1E232C]'>Request Password Reset</h3>
				<AuthForm
					onSubmit={handleSubmitForm}
					className="flex flex-col gap-y-6"
				>
					<div className="flex flex-col gap-y-1">
						<label
							htmlFor="email"
							className="text-base text-sidebarBlue font-medium"
						>
            Email
						</label>
						<Form.Item
							name="email"
							rules={
								[
									{
										message: messages.VALIDATION_EMAIL_ERROR,
										pattern: validation.email.pattern
									}
								]
							}
						>
							<Input
								placeholder="email@example.com"
								className="rounded-md py-3 px-4"
								id="email"
							/>
						</Form.Item>
					</div>

					<div className='flex justify-center items-center'>
						<Button disabled={loading} htmlType="submit" size='large' className='bg-pink_primary w-56 rounded-md outline-none border-none text-white'>
            Request reset
						</Button>
					</div>
					{error?.message && <FilteredError text={error.message} />}
				</AuthForm>
			</article>
		</Row>
	);
};

export default RequestResetPassword;
