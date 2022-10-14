// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UploadOutlined,UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import { Breadcrumb, Layout, Menu } from 'antd';
import React, { useState } from 'react';

import NavHeader from './NavHeader';

const { Content, Sider } = Layout;

const AppLayout = ({ className }: { className?:string }) => {
	const [collapsed, setCollapsed] = useState<boolean>(true);

	return (
		<Layout className={className}>
			<NavHeader />
			<Layout hasSider>
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					onMouseOver={() => setCollapsed(false)}
					onMouseLeave={() => setCollapsed(true)}
					style={{
						bottom: 0,
						height: '100vh',
						left: 0,
						overflow: 'auto',
						position: 'fixed',
						top: '64px'
					}}
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
				<Layout style={{ margin:'auto auto', maxWidth:'85vw' }}>
					<Breadcrumb style={{ margin: '16px 0' }}>
						<Breadcrumb.Item>Home</Breadcrumb.Item>
						<Breadcrumb.Item>List</Breadcrumb.Item>
						<Breadcrumb.Item>AppLayout</Breadcrumb.Item>
					</Breadcrumb>
					<Content
						className="site-layout-background"
						style={{
							margin: 0,
							minHeight: 280,
							padding: 24
						}}
					>
          Content
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default styled(AppLayout)``;