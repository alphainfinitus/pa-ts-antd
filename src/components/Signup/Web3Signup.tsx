// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { isWeb3Injected } from '@polkadot/extension-dapp';
import {
	Injected,
	InjectedAccount,
	InjectedWindow
} from '@polkadot/extension-inject/types';
import { stringToHex } from '@polkadot/util';
import { Alert, Button, Divider } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserDetailsContext } from 'src/context';
import { useAddressSignupConfirmMutation, useAddressSignupStartMutation } from 'src/generated/graphql';
import { APPNAME } from 'src/global/appName';
import { handleTokenChange } from 'src/services/auth.service';
import { Wallet } from 'src/types';
import AccountSelectionForm from 'src/ui-components/AccountSelectionForm';
import AuthForm from 'src/ui-components/AuthForm';
import FilteredError from 'src/ui-components/FilteredError';
import Loader from 'src/ui-components/Loader';
import getEncodedAddress from 'src/util/getEncodedAddress';
import getNetwork from 'src/util/getNetwork';

import { ReactComponent as NovaWalletIcon } from '../../assets/wallet/nova-wallet-star.svg';
import { ReactComponent as PolkadotJSIcon } from '../../assets/wallet/polkadotjs-icon.svg';
import { ReactComponent as SubWalletIcon } from '../../assets/wallet/subwallet-icon.svg';
import { ReactComponent as TalismanIcon } from '../../assets/wallet/talisman-icon.svg';
import ExtensionNotDetected from '../ExtensionNotDetected';

interface Props {
  chosenWallet: Wallet;
  setDisplayWeb2: () => void;
  setWalletError: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface IWalletIconProps {
  which: Wallet;
}

const WalletIcon: FC<IWalletIconProps> = ({ which }) => {
	switch (which) {
	case Wallet.POLKADOT:
		return <PolkadotJSIcon className="h-8 w-8" />;
	case Wallet.TALISMAN:
		return <TalismanIcon className="h-8 w-8" />;
	case Wallet.SUBWALLET:
		return <SubWalletIcon className="h-8 w-8" />;
	case Wallet.NOVAWALLET:
		return <NovaWalletIcon className="h-8 w-8" />;
	default:
		return null;
	}
};
const Web3Signup: FC<Props> = ({
	chosenWallet,
	setDisplayWeb2,
	setWalletError
}) => {
	const [error, setErr] = useState<Error | null>(null);
	const [accounts, setAccounts] = useState<InjectedAccount[]>([]);
	const [address, setAddress] = useState<string>('');
	const [isAccountLoading, setIsAccountLoading] = useState(true);
	const [extensionNotFound, setExtensionNotFound] = useState(false);
	const [accountsNotFound, setAccountsNotFound] = useState(false);
	const navigate = useNavigate();
	const [addressSignupStartMutation] = useAddressSignupStartMutation();
	const [addressSignupConfirmMutation, { loading }] = useAddressSignupConfirmMutation();
	const currentUser = useUserDetailsContext();
	useEffect(() => {
		if (!accounts?.length) {
			getAccounts(chosenWallet);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accounts?.length, chosenWallet]);

	const getAccounts = async (chosenWallet: Wallet): Promise<undefined> => {
		const injectedWindow = window as Window & InjectedWindow;

		let wallet = isWeb3Injected
			? injectedWindow.injectedWeb3[chosenWallet]
			: null;

		if (!wallet) {
			wallet = Object.values(injectedWindow.injectedWeb3)[0];
		}
		if (!wallet) {
			setExtensionNotFound(true);
			setIsAccountLoading(false);
			return;
		} else {
			setExtensionNotFound(false);
		}

		let injected: Injected | undefined;
		try {
			injected = await new Promise((resolve, reject) => {
				const timeoutId = setTimeout(() => {
					reject(new Error('Wallet Timeout'));
				}, 60000); // wait 60 sec

				wallet!.enable(APPNAME)
					.then((value) => { clearTimeout(timeoutId); resolve(value); })
					.catch((error) => { reject(error); });
			});
		} catch (err) {
			setIsAccountLoading(false);
			console.log(err?.message);
			if (err?.message == 'Rejected') {
				setWalletError('');
				handleToggle();
			} else if (
				err?.message ==
        'Pending authorisation request already exists for this site. Please accept or reject the request.'
			) {
				setWalletError(
					'Pending authorisation request already exists. Please accept or reject the request on the wallet extension and try again.'
				);
				handleToggle();
			} else if (err?.message == 'Wallet Timeout') {
				setWalletError(
					'Wallet authorisation timed out. Please accept or reject the request on the wallet extension and try again.'
				);
				handleToggle();
			}
		}
		if (!injected) {
			return;
		}

		const accounts = await injected.accounts.get();
		if (accounts.length === 0) {
			setAccountsNotFound(true);
			setIsAccountLoading(false);
			return;
		} else {
			setAccountsNotFound(false);
		}

		accounts.forEach((account) => {
			account.address = getEncodedAddress(account.address) || account.address;
		});

		setAccounts(accounts);
		if (accounts.length > 0) {
			setAddress(accounts[0].address);
		}
		setIsAccountLoading(false);
		return;
	};
	const onAccountChange = (event: React.SyntheticEvent<HTMLElement, Event>, address: string) => {
		setAddress(address);
	};

	const handleSignup: ( values: React.BaseSyntheticEvent<object, any, any> | undefined ) => void = async  () => {
		if (!accounts.length) {
			return getAccounts(chosenWallet);
		}
		try {
			const injectedWindow = window as Window & InjectedWindow;

			let wallet = isWeb3Injected
				? injectedWindow.injectedWeb3[chosenWallet]
				: null;

			if (!wallet) {
				wallet = Object.values(injectedWindow.injectedWeb3)[0];
			}

			if (!wallet) {
				setExtensionNotFound(true);
				setIsAccountLoading(false);
				return;
			} else {
				setExtensionNotFound(false);
			}

			const injected = await wallet.enable(APPNAME);

			const signRaw = injected && injected.signer && injected.signer.signRaw;

			if (!signRaw) {
				return console.error('Signer not available');
			}

			const { data: startResult } = await addressSignupStartMutation({
				variables: {
					address: address
				}
			});

			const signMessage = startResult?.addressSignupStart?.signMessage;

			if (!signMessage) {
				throw new Error('Challenge message not found');
			}

			const { signature } = await signRaw({
				address: address,
				data: stringToHex(signMessage),
				type: 'bytes'
			});

			const { data: signResult } = await addressSignupConfirmMutation({
				variables: {
					address: address,
					network: getNetwork(),
					signature
				}
			});

			if (signResult?.addressSignupConfirm?.token) {
				handleTokenChange(signResult.addressSignupConfirm.token, currentUser);
				navigate(-1);
			} else {
				throw new Error('Web3 Login failed');
			}
		} catch (error) {
			setErr(error);
		}
	};
	const handleToggle = () => setDisplayWeb2();
	return (
		<article className="bg-white shadow-md rounded-md p-8 flex flex-col gap-y-6">
			<h3 className="text-2xl font-semibold text-[#1E232C] flex flex-col gap-y-4">
				<span>Sign Up</span>
				<p className='flex gap-x-2 items-center justify-center'>
					<span>
						<WalletIcon which={chosenWallet} />
					</span>
					<span className='text-navBlue text-lg sm:text-xl'>
						{
							chosenWallet.charAt(0).toUpperCase() + chosenWallet.slice(1).replace('-', '.')
						}
					</span>
				</p>
			</h3>
			<AuthForm onSubmit={handleSignup} className="flex flex-col gap-y-6">
				{extensionNotFound?
					<div className='flex justify-center items-center my-5'>
						<ExtensionNotDetected chosenWallet={chosenWallet} />
					</div>
					: null
				}
				{accountsNotFound && (
					<div className='flex justify-center items-center my-5'>
						<Alert
							message="You need at least one account in Polkadot-js extension to login."
							description="Please reload this page after adding accounts."
							type="info"
							showIcon
						/>
					</div>
				)}
				{isAccountLoading ? (
					<div className="my-5">
						<Loader
							size="large"
							timeout={3000}
							text="Requesting Web3 accounts"
						/>
					</div>
				) : accounts.length > 0 && (
					<>
						<div className='flex justify-center items-center my-5'>
							<AccountSelectionForm
								title='Choose linked account'
								accounts={accounts}
								address={address}
								onAccountChange={onAccountChange}
							/>
						</div>
						<div className="flex justify-center items-center">
							<Button
								disabled={loading}
								htmlType="submit"
								size="large"
								className="bg-pink_primary w-56 rounded-md outline-none border-none text-white"
							>
                Sign-up
							</Button>
						</div>
						<div>
							<Divider>
								<div className="flex gap-x-2 items-center">
									<span className="text-grey_primary text-md">Or</span>
									<Button
										className="p-0 border-none outline-none text-pink_primary text-md font-semibold"
										disabled={loading}
										onClick={handleToggle}
									>
                    Sign-up with Username
									</Button>
								</div>
							</Divider>
						</div>
					</>
				)}
				{error?.message && <FilteredError text={error?.message}/>}
				<div className="flex justify-center items-center gap-x-2 font-semibold">
					<label className="text-md text-grey_primary">
            Already have an account?
					</label>
					<Link to="/login" className="text-pink_primary text-md">
            Login
					</Link>
				</div>
			</AuthForm>
		</article>
	);
};

export default Web3Signup;
