// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { CheckOutlined, LinkOutlined } from '@ant-design/icons';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { stringToHex } from '@polkadot/util';
import { Button, Modal, Tooltip } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import ExtensionNotDetected from 'src/components/ExtensionNotDetected';
import { useUserDetailsContext } from 'src/context';
import { useAddressLinkConfirmMutation, useAddressLinkStartMutation, useAddressUnlinkMutation, useSetDefaultAddressMutation } from 'src/generated/graphql';
import { handleTokenChange } from 'src/services/auth.service';
import { NotificationStatus } from 'src/types';
import AddressComponent from 'src/ui-components/Address';
import queueNotification from 'src/ui-components/QueueNotification';
import cleanError from 'src/util/cleanError';
import getEncodedAddress from 'src/util/getEncodedAddress';
import getNetwork from 'src/util/getNetwork';

interface Props {
	open?: boolean;
	dismissModal?: () => void;
}

const NETWORK = getNetwork();

const Address: FC<Props> = ({ dismissModal ,open }) => {
	const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [extensionNotAvailable, setExtensionNotAvailable] = useState(false);
	const currentUser = useUserDetailsContext();
	const [addressLinkStartMutation] = useAddressLinkStartMutation();
	const [addressLinkConfirmMutation] = useAddressLinkConfirmMutation();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [addressUnlinkMutation] = useAddressUnlinkMutation();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [setDefaultAddressMutation] = useSetDefaultAddressMutation();

	const refetch = async () => {
		const extensions = await web3Enable(getNetwork());

		if (extensions.length === 0) {
			setExtensionNotAvailable(true);
			return;
		} else {
			setExtensionNotAvailable(false);
		}
		const allAccounts = await web3Accounts();

		setAccounts(allAccounts);
	};
	useEffect(() => {
		refetch();
	}, []);

	interface AccountsDetails {
		accounts: InjectedAccountWithMeta[];
		title: string;
	}

	const handleDefault = async (address: InjectedAccountWithMeta['address']) => {
		try {
			const addressDefaultResult = await setDefaultAddressMutation({
				variables: {
					address
				}
			});

			if (addressDefaultResult.data?.setDefaultAddress?.token) {
				handleTokenChange(addressDefaultResult.data?.setDefaultAddress?.token, currentUser);
			}
			queueNotification({
				header: 'Success!',
				message: addressDefaultResult.data?.setDefaultAddress?.message || '',
				status: NotificationStatus.SUCCESS
			});
		} catch (error) {
			console.error(error);
			queueNotification({
				header: 'Failed!',
				message: cleanError(error.message),
				status: NotificationStatus.ERROR
			});
		}
	};

	const handleLink = async (address: InjectedAccountWithMeta['address'], account: InjectedAccountWithMeta) => {
		try {
			const injected = await web3FromSource(account.meta.source);
			const signRaw = injected && injected.signer && injected.signer.signRaw;

			if (!signRaw) {
				return console.error('Signer not available');
			}

			const addressLinkStartResult = await addressLinkStartMutation({
				variables: {
					address,
					network: NETWORK
				}
			});

			if (!addressLinkStartResult?.data?.addressLinkStart) {
				return console.error('Address link start mutation failed');
			}

			const { signature } = await signRaw({
				address,
				data: stringToHex(addressLinkStartResult.data.addressLinkStart.sign_message || ''),
				type: 'bytes'
			});

			const addressLinkConfirmResult = await addressLinkConfirmMutation({
				variables: {
					address_id: addressLinkStartResult.data.addressLinkStart.address_id || 0,
					signature
				}
			});

			if (addressLinkConfirmResult.data?.addressLinkConfirm?.token) {
				handleTokenChange(addressLinkConfirmResult.data?.addressLinkConfirm?.token, currentUser);
			}

			queueNotification({
				header: 'Success!',
				message: addressLinkConfirmResult?.data?.addressLinkConfirm?.message || '',
				status: NotificationStatus.SUCCESS
			});
		} catch (error) {
			console.error(error);
			queueNotification({
				header: 'Failed!',
				message: cleanError(error.message),
				status: NotificationStatus.ERROR
			});
		}
	};

	const handleUnlink = async (address: InjectedAccountWithMeta['address']) => {
		try {
			const addressUnlinkConfirmResult = await addressUnlinkMutation({
				variables: {
					address
				}
			});

			if (addressUnlinkConfirmResult.data?.addressUnlink?.token) {
				handleTokenChange(addressUnlinkConfirmResult.data?.addressUnlink?.token, currentUser);
			}

			queueNotification({
				header: 'Success!',
				message: addressUnlinkConfirmResult?.data?.addressUnlink?.message || '',
				status: NotificationStatus.SUCCESS
			});
		} catch (error) {
			console.error(error);
			queueNotification({
				header: 'Failed!',
				message: cleanError(error.message),
				status: NotificationStatus.ERROR
			});
		}
	};
	const UnlinkButton: FC<{ address: string }> = ({ address }) => {
		const StyledUnlinkButton: FC<{ withClickHandler?: boolean }> = ({ withClickHandler = false }) => {
			return (
				<Button
					className={`font-medium text-sm m-0 p-0 outline-none border-none flex items-center justify-center text-red_primary ${!withClickHandler? 'opacity-50': ''}`}
					disabled={withClickHandler ? false : true}
					onClick={() => withClickHandler ? handleUnlink(address) : null}
				>
					Unlink
				</Button>
			);
		};

		return currentUser.defaultAddress === address
			? <Tooltip color='#E5007A' title="You can't unlink your default address">
				<StyledUnlinkButton />
			</Tooltip>
			: <StyledUnlinkButton withClickHandler/>;
	};

	const SetDefaultAddress: FC<{ address : string }> = ({ address }) => {
		return currentUser.defaultAddress !== address
			? <Button
				className='font-medium text-sm m-0 p-0 text-grey_primary outline-none border-none flex items-center justify-center'
				onClick={() => handleDefault(address)}
			>
				Set default
			</Button>
			: <span className='font-medium text-sm flex items-center gap-x-2 text-green_primary'>
				<CheckOutlined />
				Default address
			</span>;
	};

	const addressList = ({ accounts, title }: AccountsDetails) => {
		return (
			<article className='flex flex-col gap-y-2'>
				<label className='font-medium text-sm tracking-wide text-sidebarBlue'>{title}</label>
				<ul className='flex flex-col gap-y-4'>
					{accounts.map(account => {
						const address = getEncodedAddress(account.address);
						const isLinked = address && currentUser.addresses?.includes(address);
						if (isLinked && title.startsWith('Available')) {
							return null;
						}
						return address &&
									<li key={address} className='grid grid-cols-6 gap-x-2 items-center'>
										<AddressComponent
											className='col-span-3'
											address={address}
											extensionName={account.meta.name}
										/>
										{ isLinked
											? <>
												<div className='col-span-1'>
													<UnlinkButton address={address} />
												</div>
												<div className="col-span-2">
													<SetDefaultAddress address={address} />
												</div>
											</>
											: <>
												<div className="col-span-1">
													<Button
														className='font-medium text-sm m-0 p-0 text-grey_primary outline-none border-none flex items-center justify-center'
														onClick={() => handleLink(address, account)}
														icon={
															<LinkOutlined />
														}
													>
														Link
													</Button>
												</div>
											</>
										}
									</li>;
					})}
				</ul>
			</article>
		);
	};

	return (
		<Modal
			closable={false}
			title={
				<span className='font-medium text-lg tracking-wide text-sidebarBlue'>
					Link Address
				</span>
			}
			open={open}
			className='mb-8 md:min-w-[600px]'
			footer={
				[
					<Button
						key="cancel"
						onClick={dismissModal}
						className='rounded-lg font-semibold text-lg leading-7 text-white py-5 outline-none border-none px-7 inline-flex items-center justify-center bg-pink_primary'
					>
						Cancel
					</Button>
				]
			}
		>
			{
				extensionNotAvailable
					? <div className='max-w-[600px]'><ExtensionNotDetected /></div>
					: <section className='flex flex-col gap-y-8'>
						{currentUser?.addresses && currentUser?.addresses?.length > 0 &&  addressList({
							accounts: currentUser?.addresses?.sort().map((address): InjectedAccountWithMeta => ({
								address: address,
								meta: { source: '' }
							})) || [],
							title: 'Linked addresses'
						})}
						{accounts.length && addressList({
							accounts,
							title: 'Available addresses'
						})}
					</section>
			}
		</Modal>
	);
};

export default Address;