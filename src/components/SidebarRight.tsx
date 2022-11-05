// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { CloseCircleOutlined } from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
import React from 'react';
import { ReactNode } from 'react-markdown/lib/react-markdown';
interface Props {
	className?: string;
	children?: ReactNode;
	open: boolean;
	closeSidebar: () => void;
}

const SidebarRight = ({ className, children, open, closeSidebar } : Props) => {
	return (
		<Sider
			trigger={null}
			className={`${className} ${!open ? 'hidden overflow-y-hidden min-w-0 max-w-0 w-0': 'min-w-[90%] xl:min-w-[50%] max-w-[70%]'} bg-white lg:block top-0 right-0 h-screen overflow-y-auto fixed z-50 drop-shadow-2xl`}
		>
			<div className='w-full flex justify-end p-3'><CloseCircleOutlined onClick={closeSidebar} className='text-lg cursor-pointer hover:text-black' /></div>
			<div className='p-3 md:p-6 h-[92vh] overflow-y-auto'>
				{children}
			</div>
		</Sider>
	);
};

export default SidebarRight;