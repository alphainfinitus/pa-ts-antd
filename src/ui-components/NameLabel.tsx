// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Address from './Address';

interface Props {
	className?: string
	defaultAddress?: string | null
	username?: string
	disableIdenticon?: boolean
}

const NameLabel = ({ className, defaultAddress, username, disableIdenticon = false } : Props) => {
	return (
		<div className={className}>
			{!defaultAddress ? <span className='username text-sidebarBlue'> { username } </span> :
				<Address
					address={defaultAddress}
					className='text-sm'
					displayInline={true}
					disableIdenticon={disableIdenticon}
				/>}
		</div>
	);
};

export default NameLabel;