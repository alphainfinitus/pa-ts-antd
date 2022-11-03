// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Alert, Button, Form, Input } from 'antd';
import React, { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useModalContext, useUserDetailsContext } from 'src/context';
import { useSignupMutation } from 'src/generated/graphql';
import { handleTokenChange } from 'src/services/auth.service';
import { Wallet } from 'src/types';
import AuthForm from 'src/ui-components/AuthForm';
import FilteredError from 'src/ui-components/FilteredError';
import messages from 'src/util/messages';
import * as validation from 'src/util/validation';

import WalletButtons from '../Login/WalletButtons';

interface Props {
	onWalletSelect: (wallet: Wallet) => void;
	walletError: string | undefined;
}

const Web2Signup: FC<Props> = ({ walletError, onWalletSelect }) => {
	const { password, username } = validation;
	const navigate = useNavigate();
	const currentUser = useUserDetailsContext();
	const { setModal } = useModalContext();
	const [isPassword, setIsPassword] = useState(false);
	const [signupMutation, { error, loading }] = useSignupMutation();
	const [signUpInfo, setSignUpInfo] = useState({
		email: '',
		username: ''
	});
	const [firstPassword, setFirstPassword] = useState('');

	const handleSubmitForm = (data: any): void => {
		if (isPassword) {
			const { second_password } = data;
			if (second_password) {
				const { email, username } = signUpInfo;
				signupMutation({
					variables: {
						email,
						password: second_password,
						username
					}
				})
					.then(({ data }) => {
						if (data && data.signup && data.signup.token) {
							handleTokenChange(data.signup.token, currentUser);
							if (email) {
								setModal({ content: 'We sent you an email to verify your address. Click on the link in the email.', title: 'You\'ve got some mail' });
							}
							navigate(-1);
						}}
					).catch((e) => {
						console.error('Login error', e);
					});
			}
		} else {
			const { username, email } = data;
			if (username && email) {
				setSignUpInfo((prevInfo) => ({ ...prevInfo, email, username }));
				setIsPassword(true);
			}
		}
	};
	return (
		<article className="bg-white shadow-md rounded-md p-8 flex flex-col gap-y-6">
			<div className='grid grid-cols-2'>
				<div onClick={() => {
					setIsPassword(false);
					if (error) {
						error.message ='';
					}
				}} className={`cursor-pointer font-medium text-grey_primary flex flex-col gap-y-2 text-xs justify-center items-center sm:flex-row sm:text-sm gap-x-2 border-b-2 pb-2 ${!isPassword &&'border-pink_primary'}`}>
					<span className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8 text-white ${isPassword?'bg-green_primary':'bg-pink_primary'} rounded-full`}>1</span>
					<span>Create Username</span>
				</div>
				<div className={`font-medium text-grey_primary flex flex-col gap-y-2 text-xs justify-center items-center sm:flex-row sm:text-sm gap-x-2 border-b-2 pb-2 ${isPassword &&'border-pink_primary'}`}>
					<span className={`flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8 text-white ${isPassword?'bg-pink_primary':'bg-grey_secondary'} rounded-full`}>2</span>
					<span>Set Password</span>
				</div>
			</div>
			<h3 className="text-2xl font-semibold text-[#1E232C]">
				{isPassword?'Set Password': 'Sign Up'}
			</h3>
			{walletError && <Alert message={walletError} type="error" />}
			<AuthForm
				onSubmit={handleSubmitForm}
				className='flex flex-col gap-y-6'
			>
				{
					isPassword?
						<>
							<div className="flex flex-col gap-y-1">
								<label
									className="text-base text-sidebarBlue font-medium"
									htmlFor="first_password"
								>
									Set Password
								</label>
								<Form.Item
									name="first_password"
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
										onChange={(e) => {
											setFirstPassword(e.target.value);
										}}
										placeholder='Password'
										className="rounded-md py-3 px-4"
										id="first_password"
									/>
								</Form.Item>
							</div>
							<div className="flex flex-col gap-y-1">
								<label
									className="text-base text-sidebarBlue font-medium"
									htmlFor="second_password"
								>
									Re-enter Password
								</label>
								<Form.Item
									name="second_password"
									rules={[
										{
											message: 'Password don\'t match',
											validator(rule, value, callback) {
												if (callback && value !== firstPassword){
													callback(rule?.message?.toString());
												}else {
													callback();
												}
											}
										}
									]}
								>
									<Input.Password
										placeholder='Password'
										className="rounded-md py-3 px-4"
										id="second_password"
									/>
								</Form.Item>
							</div>
						</>
						:<>
							<div className="flex flex-col gap-y-1">
								<label
									className="text-base text-sidebarBlue font-medium tracking-wide"
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
									htmlFor="email"
									className="text-base text-sidebarBlue font-medium tracking-wide"
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
						</>
				}
				<div className="flex justify-center items-center">
					<Button
						disabled={loading}
						htmlType="submit"
						size="large"
						className="bg-pink_primary w-56 rounded-md outline-none border-none text-white"
					>
						{isPassword?'Sign Up': 'Next'}
					</Button>
				</div>
				{error?.message && <FilteredError text={error.message} />}
				<div>
					<WalletButtons disabled={loading} onWalletSelect={onWalletSelect} />
				</div>
				<div className='flex justify-center items-center gap-x-2 font-semibold'>
					<label className='text-md text-grey_primary'>Already have an account?</label>
					<Link to='/login' className='text-pink_primary text-md'>
                        Login
					</Link>
				</div>
			</AuthForm>
		</article>
	);
};

export default Web2Signup;