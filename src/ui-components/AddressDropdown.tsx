// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { DownOutlined } from '@ant-design/icons';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import { Dropdown, Menu } from 'antd';
import React from 'react';
import Address from 'src/ui-components/Address';

interface Props {
  className?: string;
  selectedAccount: InjectedAccount;
  accounts: InjectedAccount[];
  onAccountChange: (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: InjectedAccount
  ) => void;
}

const AddressDropdown = ({
	className = 'px-4 py-3 border-2 rounded-md',
	selectedAccount,
	accounts,
	onAccountChange
}: Props) => {
	return (
		<Dropdown
			className={className}
			overlay={
				<Menu
					onClick={(e) => {
						const account = accounts.find(
							(account) => account.address === e.key
						);
						if (account) {
							onAccountChange(e.domEvent, account);
						}
					}}
					items={accounts.map((account) => ({
						key: account.address,
						label: (
							<Address extensionName={account.name} address={account.address} />
						)
					}))}
				/>
			}
		>
			<div className="flex justify-between items-center">
				<Address
					extensionName={selectedAccount?.name}
					address={selectedAccount?.address}
				/>
				<span>
					<DownOutlined />
				</span>
			</div>
		</Dropdown>
	);
};

export default AddressDropdown;
