// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccount } from '@polkadot/extension-inject/types';
import React from 'react';

import AddressDropdown from './AddressDropdown';

interface Props{
	title: string
	selectedAccount: InjectedAccount
	accounts: InjectedAccount[]
	onAccountChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: InjectedAccount) => void
	withBalance?: boolean
}

const AccountSelectionForm = ({ title, selectedAccount, accounts, onAccountChange }: Props) =>
	<article className='w-full'>
		<h3 className='mb-2 font-semibold text-base'>{title}</h3>
		<AddressDropdown
			selectedAccount={selectedAccount}
			accounts={accounts}
			onAccountChange={onAccountChange}
		/>
	</article>;

export default AccountSelectionForm;