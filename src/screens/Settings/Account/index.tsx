// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from '@xstyled/styled-components';
import { Button, Form, Row, Switch } from 'antd';
import React, { FC, useState } from 'react';
import Header from 'src/screens/Settings/Header';

import Address from './Address';
import MultiSignatureAddress from './MultiSignatureAddress';

interface IAddressHeaderProps {
    header?: string;
    id?: string;
}

const AddressHeader: FC<IAddressHeaderProps> = ({ header, id }) => {
	return (
		<article className='flex items-center gap-x-2 text-sm font-normal tracking-wide leading-6 mb-6'>
			<label className='cursor-pointer' htmlFor={id}>
				{header}
			</label>
			<Switch id={id} size='small' defaultChecked />
		</article>
	);
};

interface Props {
	className?: string;
}

const Account: FC<Props> = ({ className }) => {
	const [isSave] = useState(false);
	return (
		<Row className={`${className} flex flex-col w-full`}>
			<Header heading='Account Settings' subHeading='Update your account settings' />
			<Form className='mt-8'>
				<section>
					<AddressHeader header='Link Address' id='link_address' />
					<Address />
				</section>
				<section>
					<AddressHeader header='Link Multi Signature Address' id='link_multi_address' />
					<MultiSignatureAddress/>
				</section>
				<Button
					disabled={!isSave}
					size='large'
					htmlType='submit'
					className={`rounded-lg font-semibold text-lg leading-7 text-white py-3 outline-none border-none px-14 flex items-center justify-center ${isSave?'bg-pink_primary':'bg-icon_grey'}`}
				>
                    Save
				</Button>
			</Form>
		</Row>
	);
};

export default styled(Account)`
	.ant-switch-checked {
		background-color: green_primary !important;
	}
`;