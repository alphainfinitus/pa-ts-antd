// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Space } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React from 'react';
import { Link } from 'react-router-dom';
import NetworkDropdown from 'src/ui-components/NetworkDropdown';

import { ReactComponent as PALogoBlack } from '../../assets/pa-logo-black.svg';

const NavHeader = ({ className }: { className?:string }) => {
	return (
		<Header className={`flex bg-white h-[60px] max-h-[60px] ${className}`}>
			<nav className='w-5/6 mx-auto flex items-center justify-between'>
				<Link className='flex' to='/'><PALogoBlack /></Link>
				<Space className='flex items-center justify-between'>
					<NetworkDropdown />
					<Link className='text-navLinkBlue font-medium' to='/login'>Login</Link>
					<Link className='text-navLinkBlue font-medium' to='/signup'>Sign-up</Link>
				</Space>
			</nav>
		</Header>
	);
};

export default NavHeader;