// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountFlags, DeriveAccountInfo, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import Identicon from '@polkadot/react-identicon';
import styled from '@xstyled/styled-components';
import { Space, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';

import shortenAddress from '../util/shortenAddress';
import IdentityBadge from './IdentityBadge';

interface Props {
	address: string
	className?: string
	displayInline?: boolean
	disableIdenticon?: boolean
	extensionName?: string
	popupContent?: string
	disableAddress?:boolean
	shortenAddressLength?:number
}

const Address = ({ address, className, displayInline, disableIdenticon, extensionName, popupContent, disableAddress, shortenAddressLength }: Props): JSX.Element => {
	const { api, apiReady } = useContext(ApiContext);
	const [mainDisplay, setMainDisplay] = useState<string>('');
	const [sub, setSub] = useState<string | null>(null);
	const [identity, setIdentity] = useState<DeriveAccountRegistration | null>(null);
	const [flags, setFlags] = useState<DeriveAccountFlags | undefined>(undefined);

	useEffect(() => {
		if (!api){
			return;
		}

		if (!apiReady){
			return;
		}

		let unsubscribe: () => void;

		api.derive.accounts.info(address, (info: DeriveAccountInfo) => {
			setIdentity(info.identity);

			if (info.identity.displayParent && info.identity.display){
				// when an identity is a sub identity `displayParent` is set
				// and `display` get the sub identity
				setMainDisplay(info.identity.displayParent);
				setSub(info.identity.display);
			} else {
				// There should not be a `displayParent` without a `display`
				// but we can't be too sure.
				setMainDisplay(info.identity.displayParent || info.identity.display || info.nickname || '');
			}
		})
			.then(unsub => { unsubscribe = unsub; })
			.catch(e => console.error(e));

		return () => unsubscribe && unsubscribe();
	}, [address, api, apiReady]);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		api.derive.accounts.flags(address, (result: DeriveAccountFlags) => {
			setFlags(result);
		})
			.then(unsub => { unsubscribe = unsub; })
			.catch(e => console.error(e));

		return () => unsubscribe && unsubscribe();
	}, [address, api, apiReady]);

	return (
		<div className={displayInline ? `${className} display_inline`: className}>
			{
				!disableIdenticon ?
					<Identicon
						className='image identicon'
						value={address}
						size={displayInline ? 20 : 32}
						theme={'polkadot'}
					/>
					:
					null
			}
			{!disableAddress && <div className='content'>
				{displayInline
					// When inline disregard the extension name.
					? popupContent
						? <Space>
							{identity && mainDisplay && <IdentityBadge identity={identity} flags={flags} />}
							<Tooltip color='#E5007A' title={popupContent}>
								<div className={'header display_inline identityName'}>
									{mainDisplay || shortenAddress(address, shortenAddressLength)}
									{sub && <span className='sub'>/{sub}</span>}
								</div>
							</Tooltip>
						</Space>
						: <>
							<Space className={'description display_inline'}>
								{identity && mainDisplay && <IdentityBadge identity={identity} flags={flags} />}
								<span className='identityName'>
									{ mainDisplay || shortenAddress(address, shortenAddressLength)}
									{sub && <span className='sub'>/{sub}</span>}
								</span>
							</Space>
						</>
					: extensionName || mainDisplay
						? popupContent
							?
							<Tooltip title={popupContent}>
								<Space>
									<Space className={'header'}>
										{identity && mainDisplay && !extensionName && <IdentityBadge identity={identity} flags={flags} />}
										<span className='identityName'>
											{extensionName || mainDisplay}
											{!extensionName && sub && <span className='sub'>/{sub}</span>}
										</span>
									</Space>
									<div className={'description display_inline'}>{shortenAddress(address, shortenAddressLength)}</div>
								</Space>
							</Tooltip>
							: <Space>
								<Space className={'header'}>
									{identity && mainDisplay && !extensionName && <IdentityBadge identity={identity} flags={flags} />}
									<span className='identityName'>
										{extensionName || mainDisplay}
										{!extensionName && sub && <span className='sub'>/{sub}</span>}
									</span>
								</Space>
								<div className={'description text-xs'}>{shortenAddress(address, shortenAddressLength)}</div>
							</Space>
						: <div className={'description text-xs'}>{shortenAddress(address, shortenAddressLength)}</div>
				}
			</div>}
		</div>
	);
};

export default styled(Address)`
	position: relative;
	display: flex;
	align-items: center;
	
	.content {
		display: inline-block;
		color: nav_blue !important;
	}

	.identicon {
		margin-right: 0.25rem;
	}

	.identityName{
		filter: grayscale(100%);
	}

	.header {
		color: black_text;
		font-weight: 500;
		margin-right: 0.4rem;
	}

	.description {
		color: nav_blue;
		margin-right: 0.4rem;
	}

	.display_inline {
		display: inline-flex !important;
	}

	.sub {
		color: nav_blue;
		line-height: inherit;
	}
`;
