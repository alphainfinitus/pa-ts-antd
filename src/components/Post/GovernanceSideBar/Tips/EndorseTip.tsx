// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccount } from '@polkadot/extension-inject/types';
import styled from '@xstyled/styled-components';
import { Alert, Button, Form } from 'antd';
import BN from 'bn.js';
import React, { useContext, useEffect,useState } from 'react';
import frowningFace from 'src/assets/frowning-face.png';
import { ApiContext } from 'src/context/ApiContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useGetCouncilMembersQuery } from 'src/generated/graphql';
import { LoadingStatusType, NotificationStatus } from 'src/types';
import AccountSelectionForm from 'src/ui-components/AccountSelectionForm';
import BalanceInput from 'src/ui-components/BalanceInput';
import Card from 'src/ui-components/Card';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import Loader from 'src/ui-components/Loader';
import queueNotification from 'src/ui-components/QueueNotification';

interface Props {
	accounts: InjectedAccount[]
	address: string
	className?: string
	getAccounts: () => Promise<undefined>
	tipHash?: string
	onAccountChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: any) => void
}

const EndorseTip = ({
	accounts,
	address,
	className,
	getAccounts,
	tipHash,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onAccountChange
}: Props) => {
	const ZERO = new BN(0);
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: false, message:'' });
	const [endorseValue, setEndorseValue] = useState<BN>(ZERO);
	const [isCouncil, setIsCouncil] = useState(false);
	const [forceEndorse, setForceEndorse] = useState(false);
	const councilQueryresult = useGetCouncilMembersQuery();
	const [currentCouncil, setCurrentCouncil] = useState<string[]>([]);
	const { api, apiReady } = useContext(ApiContext);
	const { addresses } = useContext(UserDetailsContext);

	useEffect(() => {
		// it will iterate through all addresses
		addresses && addresses.some(address => {
			if (currentCouncil.includes(address)) {
				setIsCouncil(true);
				// this breaks the loop as soon as we find a matching address
				return true;
			}
			return false;
		});
	}, [addresses, currentCouncil]);

	useEffect(() => {
		councilQueryresult.data?.councils?.[0]?.members?.forEach( member => {
			setCurrentCouncil(currentCouncil => [...currentCouncil, member?.address]);
		});
	}, [councilQueryresult]);

	const onValueChange = (balance: BN) => setEndorseValue(balance);

	const handleEndorse = async () => {
		if (!tipHash) {
			console.error('tipHash not set');
			return;
		}

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		setLoadingStatus({ isLoading: true, message: 'Waiting for signature' });
		const endorse = api.tx.treasury.tip(tipHash, endorseValue);

		endorse.signAndSend(address, ({ status }) => {
			if (status.isInBlock) {
				queueNotification({
					header: 'Success!',
					message: `Endorse tip #${tipHash} successful.`,
					status: NotificationStatus.SUCCESS
				});
				setLoadingStatus({ isLoading: false, message: '' });
				console.log(`Completed at block hash #${status.asInBlock.toString()}`);
			} else {
				if (status.isBroadcast){
					setLoadingStatus({ isLoading: true, message: 'Broadcasting the endorsement' });
				}
				console.log(`Current status: ${status.type}`);
			}
		}).catch((error) => {
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

	const GetAccountsButton = () =>
		<Form>
			<Form.Item className='button-container'>
				<div>Only council members can endorse tips.</div><br/>
				<Button
					onClick={getAccounts}
				>
					Endorse
				</Button>
			</Form.Item>
		</Form>;

	const noAccount = accounts.length === 0;

	const endorse = noAccount
		? <GetAccountsButton/>
		: loadingStatus.isLoading
			? <Card className={'LoaderWrapper'}>
				<Loader text={loadingStatus.message}/>
			</Card>
			: <Card>
				<AccountSelectionForm
					title='Endorse with account'
					accounts={accounts}
					address={address}
					onAccountChange={onAccountChange}
					withBalance
				/>
				<BalanceInput
					label={'Value'}
					helpText={'Allocate a suggested tip amount. With enough endorsements, the suggested values are averaged and sent to the beneficiary.'}
					placeholder={'123'}
					onChange={onValueChange}
				/>
				<Button
					disabled={!apiReady}
					onClick={handleEndorse}
				>
					Endorse
				</Button>
			</Card>;
	const NotCouncil = () =>
		<GovSidebarCard>
			<h3 className='dashboard-heading mb-6'>Endorse with account!</h3>
			<Alert className='mb-6' type='warning' message={<div className='flex items-center gap-x-2'>
				<span>
					No account found from the council
				</span>
				<img width={25} height={25} src={frowningFace} alt="frowning face" />
			</div>} />
			<Button onClick={() => setForceEndorse(true)}>Let me try still.</Button>
		</GovSidebarCard>;

	return (
		<div className={className}>
			{isCouncil || forceEndorse
				? endorse
				: <NotCouncil/>
			}
		</div>
	);
};

export default styled(EndorseTip)`
	.LoaderWrapper {
		height: 15rem;
		position: absolute;
		width: 100%;
	}
`;
