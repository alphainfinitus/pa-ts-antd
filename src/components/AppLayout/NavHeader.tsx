// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MenuOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React from 'react';
import { Link } from 'react-router-dom';
import NetworkDropdown from 'src/ui-components/NetworkDropdown';

import { ReactComponent as PALogoBlack } from '../../assets/pa-logo-black.svg';

interface Props {
	sidebarCollapsed: boolean
	setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const NavHeader = ({ sidebarCollapsed, setSidebarCollapsed } : Props) => {
	return (
		<Header className='flex items-center bg-white h-[60px] max-h-[60px] px-6'>
			<MenuOutlined className='lg:hidden mr-5' onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
			<nav className='w-full lg:w-5/6 lg:mx-auto flex items-center justify-between'>
				<Link className='flex' to='/'><PALogoBlack /></Link>
				<Space className='flex items-center justify-between'>
					<NetworkDropdown />
					<Link className='text-navLinkBlue hover:text-pink_primary font-medium' to='/login'>Login</Link>
					<Link className='text-navLinkBlue hidden lg:inline-block hover:text-pink_primary font-medium' to='/signup'>Sign-up</Link>
				</Space>
			</nav>
		</Header>
	);
};

export default NavHeader;