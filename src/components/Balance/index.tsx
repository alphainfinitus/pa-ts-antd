// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useState } from 'react';
import { useApiContext } from 'src/context';
import formatBnBalance from 'src/util/formatBnBalance';

interface Props {
	address: string
}

const Balance = ({ address }: Props) => {
	const [balance, setBalance] = useState<string>('0');
	const { api, apiReady } = useApiContext();

	useEffect(() => {
		if (!api || !apiReady || !address) return;

		let unsubscribe: () => void;

		api.derive.balances.account(address, (info: any) =>
			setBalance(info.freeBalance?.toString() || '0')
		)
			.then(unsub => { unsubscribe = unsub; })
			.catch(e => console.error(e));

		return () => unsubscribe && unsubscribe();
	}, [address, api, apiReady]);

	return (
		<div className='text-[#53595C]'>
			<span className='font-medium text-[#2E2F30]'>{formatBnBalance(balance, { numberAfterComma: 2, withUnit: true })}</span> available.
		</div>
	);
};

export default Balance;