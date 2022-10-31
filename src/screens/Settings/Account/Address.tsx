// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import React, { FC, useEffect, useState } from 'react';
import ExtensionNotDetected from 'src/components/ExtensionNotDetected';
import getNetwork from 'src/util/getNetwork';

interface Props {

}

const Address: FC<Props> = () => {
	const [, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [extensionNotAvailable, setExtensionNotAvailable] = useState(false);

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
	return (
		<article className='mb-8'>
			{
				extensionNotAvailable
					? <div className='max-w-[600px]'><ExtensionNotDetected /></div>
					: <div></div>
			}
		</article>
	);
};

export default Address;