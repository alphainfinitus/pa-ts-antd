// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { stringToHex } from '@polkadot/util';
import { Alert, Button, Checkbox, Form, Input, InputNumber, Modal } from 'antd';
import React, { FC, useState } from 'react';
import { useApiContext, useUserDetailsContext } from 'src/context';
import { useMultisigLinkConfirmMutation, useMultisigLinkStartMutation } from 'src/generated/graphql';
import { APPNAME } from 'src/global/appName';
import { chainProperties } from 'src/global/networkConstants';
import { handleTokenChange } from 'src/services/auth.service';
import { NotificationStatus } from 'src/types';
import AccountSelectionForm from 'src/ui-components/AccountSelectionForm';
import AddressComponent from 'src/ui-components/Address';
import FilteredError from 'src/ui-components/FilteredError';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import queueNotification from 'src/ui-components/QueueNotification';
import cleanError from 'src/util/cleanError';
import getEncodedAddress from 'src/util/getEncodedAddress';
import getNetwork from 'src/util/getNetwork';

interface Props {
	open?: boolean;
	dismissModal?: () => void;
}

const NETWORK = getNetwork();

const MultiSignatureAddress: FC<Props> = ({ open, dismissModal }) => {
	const [form] = Form.useForm();
	const currentUser = useUserDetailsContext();
	const [linkStarted, setLinkStarted] = useState(false);
	const [signatories, setSignatories] = useState<{[key: number| string]: string}>({ 0: '' });
	const [signatoryAccounts, setSignatoryAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [showSignatoryAccounts, setShowSignatoryAccounts] = useState(false);
	const [extensionNotAvailable, setExtensionNotAvailable] = useState(false);
	const [, setAccountsNotFound] = useState(false);
	const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [signatory, setSignatory] = useState<string>('');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [multisigLinkStartMutation, { error: startError }] = useMultisigLinkStartMutation();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [multisigLinkConfirmMutation, { loading, error }] = useMultisigLinkConfirmMutation();

	const onAccountChange = (event: React.SyntheticEvent<HTMLElement, Event>, address: string) => {
		setSignatory(address);
	};

	const { api, apiReady } = useApiContext();

	const handleDetect = async () => {
		const extensions = await web3Enable(APPNAME);
		if (extensions.length === 0) {
			setExtensionNotAvailable(true);
			return;
		} else {
			setExtensionNotAvailable(false);
		}

		const allAccounts = await web3Accounts();
		setSignatoryAccounts(allAccounts);
		setShowSignatoryAccounts(!showSignatoryAccounts);
	};

	const isSelected = (address: string) => {
		let isSelected = false;
		Object.keys(signatories).forEach((key) => {
			if (signatories[key] === address) {
				isSelected = true;
			}
		});
		return isSelected;
	};

	const handleAddSignatories = (isAdd: boolean, address = '') => {
		if (isAdd) {
			setSignatories({ ...signatories, [Object.keys(signatories).length]: address });
		} else {
			setSignatories((prev) => {
				const key = Object.keys(signatories).find((key) => signatories[key] === address);
				const newSignatories = { ...prev };
				if (key) {
					delete newSignatories[key];
				}
				return newSignatories;
			});
		}
	};

	const getSignatoryAccounts = () => {
		return (
			<>
				{signatoryAccounts.map(account => {
					const address = getEncodedAddress(account.address);

					return address &&
							<div
								key={address}
								className='flex items-center gap-x-2'
							>
								<Checkbox
									checked={isSelected(address)}
									onChange={(e) => {
										handleAddSignatories(e.target.checked, address);
									}}
								/>
								<AddressComponent
									className='item'
									address={address}
									extensionName={account.meta.name}
								/>
							</div>;
				})}
			</>
		);
	};

	const getSignatoriesArray = () => {
		const signatoriesArray: any[] = [];
		Object.keys(signatories).forEach((key) => {
			if(signatories[key] !== '') {
				signatoriesArray.push(signatories[key]);
			}
		});
		return signatoriesArray;
	};

	const handleLink = async (): Promise<undefined> => {
		if (!api || !apiReady) return;

		const extensions = await web3Enable(APPNAME);

		if (extensions.length === 0) {
			setExtensionNotAvailable(true);
			return;
		} else {
			setExtensionNotAvailable(false);
		}

		const availableAccounts = await web3Accounts();

		availableAccounts.forEach((account) => {
			account.address = getEncodedAddress(account.address) || account.address;
		});

		const accounts = availableAccounts.filter((account) => {
			return getSignatoriesArray().map(address => address.trim()).filter(address => !!address).includes(account.address);
		});

		if (accounts.length === 0) {
			setAccountsNotFound(true);
			return;
		} else {
			setAccountsNotFound(false);
		}

		setAccounts(accounts);
		if (accounts.length > 0) {
			setSignatory(accounts[0]?.address);

			const injected = await web3FromSource(accounts[0].meta.source);

			api.setSigner(injected.signer);
		}

		setLinkStarted(true);
		return;
	};

	const handleSign = async (multisigAddress: string, signatory: string, threshold: number) => {
		if (!accounts.length) {
			return;
		}

		try {
			const injected = await web3FromSource(accounts[0].meta.source);
			const signRaw = injected && injected.signer && injected.signer.signRaw;

			if (!signRaw) {
				return console.error('Signer not available');
			}

			const multisigLinkStartResult = await multisigLinkStartMutation({
				variables: {
					address: multisigAddress
				}
			});

			if (!multisigLinkStartResult?.data?.multisigLinkStart) {
				return console.error('Multisig link start mutation failed');
			}

			const { signature } = await signRaw({
				address: signatory,
				data: stringToHex(multisigLinkStartResult.data.multisigLinkStart.signMessage || ''),
				type: 'bytes'
			});
			const multisigLinkConfirmResult = await multisigLinkConfirmMutation({
				variables: {
					address: multisigAddress,
					addresses: getSignatoriesArray().join(','),
					network: NETWORK,
					signatory,
					signature,
					ss58Prefix: chainProperties?.[NETWORK]?.ss58Format,
					threshold
				}
			});

			if (multisigLinkConfirmResult.data?.multisigLinkConfirm?.token) {
				handleTokenChange(multisigLinkConfirmResult.data?.multisigLinkConfirm?.token, currentUser);
			}
			queueNotification({
				header: 'Success!',
				message: multisigLinkConfirmResult?.data?.multisigLinkConfirm?.message || '',
				status: NotificationStatus.SUCCESS
			});
			dismissModal && dismissModal();
		} catch (error) {
			console.error(error);
			queueNotification({
				header: 'Failed!',
				message: cleanError(error.message),
				status: NotificationStatus.ERROR
			});
		}
	};

	const handleFinish = (data: any) => {
		if (linkStarted) {
			handleSign(data?.multisigAddress, signatory, Number(data?.threshold));
		} else {
			handleLink();
		}
	};

	return (
		<Modal
			closable={false}
			title={<span className='font-medium text-lg tracking-wide text-sidebarBlue'>Link Multisig address</span>}
			open={open}
			className='mb-8 md:min-w-[600px]'
			footer={
				[
					<Button
						key="link"
						htmlType='submit'
						onClick={() => {
							form.submit();
						}}
						loading={loading}
						className='rounded-lg font-semibold text-lg leading-7 text-white py-5 outline-none border-none px-7 inline-flex items-center justify-center bg-pink_primary'
					>
						{linkStarted? 'Sign': 'Link'}
					</Button>,
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
			<div className='flex flex-col gap-y-2 mb-5'>
				{startError?.message && <FilteredError text={startError.message}/>}
				{error?.message && <FilteredError text={error.message}/>}
				{extensionNotAvailable && <Alert message='Please install polkadot.js extension' type='error' />}
			</div>
			<Form
				form={form}
				onFinish={handleFinish}
				className='flex flex-col gap-y-8'
			>
				<section className='flex flex-col gap-y-4 w-full'>
					<label
						className="flex items-center gap-x-3 text-sm text-sidebarBlue font-normal tracking-wide leading-6"
					>
						Signatory Addresses
						<HelperTooltip text='The signatories (aka co-owners) have the ability to create transactions using the multisig and approve transactions sent by others. But, only once the threshold (set while creating a multisig account) is reached with approvals, the multisig transaction is enacted on-chain.' />
					</label>
					<div className='flex flex-col gap-y-2'>
						{Object.keys(signatories).map(i => (
							<Input
								key={i}
								id={i}
								value={signatories[i]}
								onChange={(e) => {
									setSignatories((prev) => ({ ...prev, [e.target.id]: e.target.value }));
								}}
								placeholder='Enter signatory addresses'
								className="rounded-md py-3 px-4 border-grey_border"
							/>
						))}
					</div>
					{
						!extensionNotAvailable && <div className='flex items-center justify-between'>
							<Button
								onClick={handleDetect}
								className='font-medium text-sm text-pink_primary p-0 m-0 outline-none border-none bg-transparent flex items-center'
							>
								<span>
									Choose from available account
								</span>
								{showSignatoryAccounts ? <UpOutlined /> : <DownOutlined />}
							</Button>
							<p className='font-medium text-sm text-pink_primary p-0 m-0 outline-none border-none bg-transparent flex items-center gap-x-2'>
								<PlusOutlined />
								<span>
									Add Account
								</span>
							</p>
						</div>
					}
					<article className='flex flex-col gap-y-3'>
						{showSignatoryAccounts && signatoryAccounts.length > 0 && getSignatoryAccounts()}
					</article>
				</section>
				<section>
					<label
						className='flex items-center gap-x-3 text-sm text-sidebarBlue font-normal tracking-wide leading-6'
						htmlFor='multisigAddress'
					>
						Multisig Address
						<HelperTooltip
							text='This is the address of the multisig account with the above signatories.'
						/>
					</label>
					<Form.Item
						name="multisigAddress"
						className='m-0 mt-2.5'
					>
						<Input
							placeholder='Enter a valid multisig address'
							className="rounded-md py-3 px-4 border-grey_border"
							id="multisigAddress"
						/>
					</Form.Item>
				</section>
				<section>
					<label
						className='flex items-center gap-x-3 text-sm text-sidebarBlue font-normal tracking-wide leading-6'
						htmlFor='threshold'
					>
						Threshold
						<HelperTooltip
							text='This is the address of the multisig account with the above signatories.'
						/>
					</label>
					<Form.Item
						name="threshold"
						className='m-0 mt-2.5 w-full'
					>
						<InputNumber
							type='number'
							min={1}
							max={100}
							placeholder='Enter threshold'
							className="rounded-md py-2 px-3 border-grey_border w-full"
							id="threshold"
						/>
					</Form.Item>
				</section>
				{accounts.length > 0 && <section>
					<AccountSelectionForm
						title='Sign with account'
						accounts={accounts}
						address={signatory}
						onAccountChange={onAccountChange}
					/>
				</section>}
			</Form>
		</Modal>
	);
};

export default MultiSignatureAddress;