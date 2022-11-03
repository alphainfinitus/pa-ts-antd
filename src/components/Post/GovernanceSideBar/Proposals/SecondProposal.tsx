// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import styled from '@xstyled/styled-components';
import { Button, Modal, Spin } from 'antd';
import React, { useContext, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import AccountSelectionForm from 'src/ui-components/AccountSelectionForm';
import queueNotification from 'src/ui-components/QueueNotification';

import { LoadingStatusType,NotificationStatus } from '../../../../types';

export interface SecondProposalProps {
	accounts: InjectedAccount[]
	address: string
	className?: string
	proposalId?: number | null | undefined
	getAccounts: () => Promise<undefined>
	onAccountChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: any) => void
}

const SecondProposal = ({ className, proposalId, address, accounts, onAccountChange, getAccounts }: SecondProposalProps) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: false, message:'' });
	const { api, apiReady } = useContext(ApiContext);

	const secondProposal = async () => {
		if (!proposalId && proposalId !== 0) {
			console.error('proposalId not set');
			return;
		}

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		setLoadingStatus({ isLoading: true, message: 'Waiting for signature' });
		const second = api.tx.democracy.second(proposalId);

		second.signAndSend(address, ({ status }: any) => {
			if (status.isInBlock) {
				setLoadingStatus({ isLoading: false, message: '' });
				queueNotification({
					header: 'Success!',
					message: `Vote on proposal #${proposalId} successful.`,
					status: NotificationStatus.SUCCESS
				});

				console.log(`Completed at block hash #${status.asInBlock.toString()}`);
			} else {
				if (status.isBroadcast) {
					setLoadingStatus({ isLoading: true, message: 'Broadcasting the vote' });
				}
				console.log(`Current status: ${status.type}`);
			}
		}).catch((error: any) => {
			setLoadingStatus({ isLoading: false, message: '' });
			console.log(':( transaction failed');
			console.error('ERROR:', error);
			queueNotification({
				header: 'Failed!',
				message: error.message,
				status: NotificationStatus.ERROR
			});
		});
	};

	const openModal = () => {
		setShowModal(true);
		if(accounts.length === 0) {
			getAccounts();
		}
	};

	return (
		<div className={className}>
			<Button
				className='bg-pink_primary hover:bg-pink_secondary mb-10 text-lg text-white border-pink_primary hover:border-pink_primary rounded-lg flex items-center justify-center p-7 w-[90%] mx-auto'
				onClick={openModal}
			>
				Second
			</Button>
			<Modal
				title="Second Proposal"
				open={showModal}
				onCancel={() => setShowModal(false)}
				footer={[
					<Button className='bg-pink_primary text-white border-pink_primary hover:bg-pink_secondary' key="second" loading={loadingStatus.isLoading} disabled={!apiReady} onClick={secondProposal}>
            Second
					</Button>
				]}
			>
				<Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
					<AccountSelectionForm
						title='Endorse with account'
						accounts={accounts}
						address={address}
						withBalance
						onAccountChange={onAccountChange}
					/>
				</Spin>
			</Modal>
		</div>
	);
};

export default styled(SecondProposal)`

	.LoaderWrapper {
		height: 15rem;
		position: absolute;
		width: 100%;
	}
`;
