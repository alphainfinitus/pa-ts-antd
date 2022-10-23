// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Alert, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

interface Props{
	text?: string
	timeout?: number
	timeoutText?: string
	size?: 'default' | 'small' | 'large',
}
const Loader = ({ timeout, text, timeoutText = 'Process timeout', size = 'default' }: Props) => {
	const [displayLoader, setDisplayLoader] = useState(true);

	useEffect(() => {
		if (timeout) {
			const timer = setTimeout(() => {
				setDisplayLoader(false);
			}, timeout);

			return () => {
				clearTimeout(timer);
			};
		}
	}, [timeout]);

	return (
		<>
			<div className='flex justify-center items-center'>
				{displayLoader
					?
					<Spin tip={text} size={size} />
					:
					<Alert className='w-2/3 text-center' type='error' message={timeoutText} />
				}
			</div>
		</>
	);
};

export default Loader;
