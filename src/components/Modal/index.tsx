// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CheckOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { FC } from 'react';
import { useModalContext } from 'src/context';

const MyModal: FC = () => {
	const { modal, dismissModal } = useModalContext();
	const { content, title } = modal;
	const isModalOpen = content?.trim().length
		? content?.trim().length > 0
		: false;
	return (
		<Modal
			className='rounded-md'
			centered={true}
			title={title}
			open={isModalOpen}
			onCancel={dismissModal}
			footer={[
				<div className="w-full flex justify-center" key="got-it">
					<Button icon={<CheckOutlined />} className='bg-pink_primary text-white outline-none border-none rounded-md px-5 font-medium text-lg leading-none flex items-center justify-center' onClick={dismissModal}>Got it!</Button>
				</div>
			]}
		>
			{content}
		</Modal>
	);
};

export default MyModal;
