// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Layout, Menu, MenuProps } from 'antd';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BountiesIcon, CalendarIcon, DemocracyProposalsIcon, DiscussionsIcon, MembersIcon, MotionsIcon, NewsIcon, OverviewIcon, ReferendaIcon, TipsIcon, TreasuryProposalsIcon } from 'src/ui-components/CustomIcons';

import NavHeader from './NavHeader';
import SwitchRoutes from './SwitchRoutes';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getSiderMenuItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		children,
		icon,
		key,
		label
	} as MenuItem;
}

const overviewItems = [
	getSiderMenuItem('Overview', '/', <OverviewIcon className='text-white' />),
	getSiderMenuItem('Discussions', '/discussions', <DiscussionsIcon className='text-white' />),
	getSiderMenuItem('Calendar', '/calendar', <CalendarIcon className='text-white' />),
	getSiderMenuItem('News', '/news', <NewsIcon className='text-white' />)
];

const democracyItems = [
	getSiderMenuItem('Proposals', '/proposals', <DemocracyProposalsIcon className='text-white' />),
	getSiderMenuItem('Referenda', '/referenda', <ReferendaIcon className='text-white' />)
];

const councilItems = [
	getSiderMenuItem('Motions', '/motions', <MotionsIcon className='text-white' />),
	getSiderMenuItem('Members', '/council', <MembersIcon className='text-white' />)
];

const treasuryItems = [
	getSiderMenuItem('Proposals', '/treasury-proposals', <TreasuryProposalsIcon className='text-white' />),
	getSiderMenuItem('Bounties', '/bounties', <BountiesIcon className='text-white' />),
	getSiderMenuItem('Child Bounties', '/child_bounties', <BountiesIcon className='text-white' />),
	getSiderMenuItem('Tips', '/tips', <TipsIcon className='text-white' />)
];

const techCommItems = [
	getSiderMenuItem('Proposals', '/tech-comm-proposals', <DemocracyProposalsIcon className='text-white' />)
];

const items: MenuProps['items'] = [
	...overviewItems,

	getSiderMenuItem('Democracy', 'democracy_group', null, [
		...democracyItems
	]),

	getSiderMenuItem('Treasury', 'treasury_group', null, [
		...treasuryItems
	]),

	getSiderMenuItem('Council', 'council_group', null, [
		...councilItems
	]),

	getSiderMenuItem('Tech. Comm.', 'tech_comm_group', null, [
		...techCommItems
	])
];

const collapsedItems: MenuProps['items'] = [
	...overviewItems,
	...democracyItems,
	...councilItems,
	...treasuryItems,
	...techCommItems
];

const AppLayout = ({ className }: { className?:string }) => {
	const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const handleMenuClick = (menuItem: any) => {
		navigate(menuItem.key);
	};

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
					className={`${sidebarCollapsed ? 'hidden': 'min-w-[256px]'} sidebar bg-white lg:block bottom-0 left-0 h-screen overflow-y-auto fixed lg:sticky top-[60px] lg:top-0 z-50`}
				>
					<Menu
						theme="light"
						mode="inline"
						selectedKeys={[pathname]}
						defaultOpenKeys={['democracy_group', 'treasury_group', 'council_group', 'tech_comm_group']}
						items={sidebarCollapsed ? collapsedItems : items}
						onClick={handleMenuClick}
					/>
				</Sider>
				<Layout className='min-h-[calc(100vh-10rem)] flex flex-row'>
					<Content className='flex-initial mx-auto w-[94vw] lg:w-[85vw] xl:w-5/6 mt-6'>
						<SwitchRoutes />
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default styled(AppLayout)`
.sidebar {
	box-shadow: 6px 0px 18px rgba(0, 0, 0, 0.06);
}

.ant-menu-item-selected {
	background: #fff !important;

	.anticon {
		path {
			stroke: pink_primary !important;
		}
	}

	.ant-menu-title-content {
		color: pink_primary !important;
	}
}

.ant-menu-title-content:hover {
	color: pink_primary !important;
}

.ant-menu-item::after {
	border-right: none !important;
}

.ant-menu-title-content {
	color: #334D6E !important;
	font-weight: 500;
	font-size: 14px;
	line-height: 21px;
	letter-spacing: 0.01em;
}
`;