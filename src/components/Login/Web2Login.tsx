// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Alert, Button, Form , Input } from 'antd';
import React, { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserDetailsContext } from 'src/context';
import { useLoginMutation } from 'src/generated/graphql';
import { handleTokenChange } from 'src/services/auth.service';
import { Wallet } from 'src/types';
import AuthForm from 'src/ui-components/AuthForm';
import FilteredError from 'src/ui-components/FilteredError';
import messages from 'src/util/messages';
import * as validation from 'src/util/validation';

import WalletButtons from './WalletButtons';

interface Props {
  onWalletSelect: (wallet: Wallet) => void;
  walletError: string | undefined;
}
const Web2Login: FC<Props> = ({ walletError, onWalletSelect }) => {
	const { password, username } = validation;
	const navigate = useNavigate();
	const currentUser = useUserDetailsContext();
	const [loginMutation, { error, loading }] = useLoginMutation();

	const handleSubmitForm = (data: any): void => {
		const { username, password } = data;

		if (username && password) {
			loginMutation({
				variables: {
					password,
					username
				}
			})
				.then(({ data }) => {
					if (data && data.login && data.login.token) {
						handleTokenChange(data.login.token, currentUser);
						navigate(-1);
					}
				})
				.catch((e) => {
					console.error('Login error', e);
				});
		}
	};
	return (
		<article className="bg-white shadow-md rounded-md p-8 flex flex-col gap-y-6">
			<h3 className="text-2xl font-semibold text-[#1E232C]">Login</h3>
			{walletError && <Alert message={walletError} type="error" />}
			<AuthForm
				onSubmit={handleSubmitForm}
				className="flex flex-col gap-y-6"
			>
				<div className="flex flex-col gap-y-1">
					<label
						className="text-base text-sidebarBlue font-medium"
						htmlFor="username"
					>
                        Username
					</label>
					<Form.Item
						name="username"
						rules={[
							{
								message: messages.VALIDATION_USERNAME_REQUIRED_ERROR,
								required: username.required
							},
							{
								message: messages.VALIDATION_USERNAME_PATTERN_ERROR,
								pattern: username.pattern
							},
							{
								max: username.maxLength,
								message: messages.VALIDATION_USERNAME_MAXLENGTH_ERROR
							},
							{
								message: messages.VALIDATION_USERNAME_MINLENGTH_ERROR,
								min: username.minLength
							}
						]}
					>
						<Input
							placeholder="John"
							className="rounded-md py-3 px-4"
							id="username"
						/>
					</Form.Item>
				</div>
				<div className="flex flex-col gap-y-1">
					<label
						className="text-base text-sidebarBlue font-medium"
						htmlFor="password"
					>
                        Password
					</label>
					<Form.Item
						name="password"
						rules={[
							{
								message: messages.VALIDATION_PASSWORD_ERROR,
								required: password.required
							},
							{
								message: messages.VALIDATION_PASSWORD_ERROR,
								min: password.minLength
							}
						]}
					>
						<Input.Password
							placeholder='Password'
							className="rounded-md py-3 px-4"
							id="password"
						/>
					</Form.Item>
					<div className="text-right text-pink_primary my-3">
						<Link to="/request-reset-password">Forgot Password?</Link>
					</div>
				</div>
				<div className="flex justify-center items-center">
					<Button
						disabled={loading}
						htmlType="submit"
						size="large"
						className="bg-pink_primary w-56 rounded-md outline-none border-none text-white"
					>
                        Login
					</Button>
				</div>
				{error?.message && <FilteredError text={error.message} />}

				<div>
					<WalletButtons disabled={loading} onWalletSelect={onWalletSelect} />
				</div>

				<div className='flex justify-center items-center gap-x-2 font-semibold'>
					<label className='text-md text-grey_primary'>Don&apos;t have an account?</label>
					<Link to='/signup' className='text-pink_primary text-md'>
                        Sign Up
					</Link>
				</div>
			</AuthForm>
		</article>
	);
};

export default Web2Login;
