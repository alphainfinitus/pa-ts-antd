// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BellOutlined, BookOutlined, DownOutlined, LoginOutlined, LogoutOutlined, MenuOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserDetailsContext } from 'src/context';
import { useLogoutMutation } from 'src/generated/graphql';
import { logout } from 'src/services/auth.service';
import NetworkDropdown from 'src/ui-components/NetworkDropdown';

import { ReactComponent as PALogoBlack } from '../../assets/pa-logo-black.svg';

interface Props {
	sidebarCollapsed: boolean
	setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const NavHeader = ({ sidebarCollapsed, setSidebarCollapsed } : Props) => {
	const currentUser = useUserDetailsContext();
	const navigate = useNavigate();
	const [logoutMutation] = useLogoutMutation();

	const { setUserDetailsContextState, username } = currentUser;
	const handleLogout = async () => {
		try {
			await logoutMutation();
		} catch (error) {
			console.error(error);
		}
		logout(setUserDetailsContextState);
		navigate('/');
	};

	const dropdownMenuItems: ItemType[] = [
		{
			key: 'notification',
			label: <Link className='text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-2' to='/notification-settings'>
				<BellOutlined />
				<span>Notification</span>
			</Link>
		},
		{
			key: 'settings',
			label: <Link className='text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-2' to='/settings'>
				<SettingOutlined />
				<span>Settings</span>
			</Link>
		},
		{
			key: 'view profile',
			label: <Link className='text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-2' to={`/user/${currentUser.username}`}>
				<UserOutlined />
				View <span>Profile</span>
			</Link>
		},
		{
			key: 'tracker',
			label: <Link className='text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-2' to='/tracker'>
				<BookOutlined />
				<span>Tracker</span>
			</Link>
		},
		{
			key: 'logout',
			label: <Link className='text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-2' onClick={handleLogout} to='/'>
				<LogoutOutlined />
				<span>Logout</span>
			</Link>
		}
	];
	const menu = <Menu className='max-h-96 overflow-y-auto' items={dropdownMenuItems} />;
	return (
		<Header className='flex items-center bg-white h-[60px] max-h-[60px] px-6'>
			<MenuOutlined className='lg:hidden mr-5' onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
			<nav className='w-full lg:w-5/6 lg:mx-auto flex items-center justify-between'>
				<Link className='flex' to='/'><PALogoBlack /></Link>
				<Space className='flex items-center justify-between'>
					<NetworkDropdown />
					{username
						? <>
							<Dropdown className='ml-4' overlay={menu}>
								<div className='flex items-center gap-x-2'>
									<span className='text-navBlue font-medium'>{username}</span>
									<DownOutlined className='text-navBlue font-medium' />
								</div>
							</Dropdown>
						</>
						: <>
							<Link className='ml-4 text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-1' to='/login'>{<LoginOutlined className='lg:hidden' />} Login</Link>
							<Link className='text-navBlue hidden lg:inline-block hover:text-pink_primary font-medium' to='/signup'>Sign-up</Link>
						</>
					}
				</Space>
			</nav>
		</Header>
	);
};

export default NavHeader;