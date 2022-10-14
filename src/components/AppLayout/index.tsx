// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UploadOutlined,UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';

import NavHeader from './NavHeader';
import SwitchRoutes from './SwitchRoutes';

const { Content, Sider } = Layout;

const AppLayout = ({ className }: { className?:string }) => {
	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);

	return (
		<Layout className={className}>
			<NavHeader sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
			<Layout hasSider>
				<Sider
					trigger={null}
					collapsible
					collapsed={sidebarCollapsed}
					onMouseOver={() => setSidebarCollapsed(false)}
					onMouseLeave={() => setSidebarCollapsed(true)}
					className={`${sidebarCollapsed ? 'hidden': ''} md:block bottom-0 left-0 h-screen overflow-y-auto fixed top-[60px]`}
				>
					<div className="logo" />
					<Menu
						theme="dark"
						mode="inline"
						defaultSelectedKeys={['1']}
						items={[
							{
								icon: <UserOutlined />,
								key: '1',
								label: 'nav 1'
							},
							{
								icon: <VideoCameraOutlined />,
								key: '2',
								label: 'nav 2'
							},
							{
								icon: <UploadOutlined />,
								key: '3',
								label: 'nav 3'
							}
						]}
					/>
				</Sider>
				<Layout className='min-h-[calc(100vh-10rem)]'>
					<Content className='mx-auto w-5/6'>
						<SwitchRoutes />
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default AppLayout;