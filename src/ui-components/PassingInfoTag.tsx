// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import { Spin } from 'antd';
import React from 'react';

interface Props {
	className?: string;
	isPassing: boolean | null;
}

const PassingInfoTag = ({ className, isPassing }:Props ) => {
	const NO_INFO_TEXT = '-';

	let text = NO_INFO_TEXT;
	if (isPassing !== null){
		text = isPassing ? 'Passing' : 'Failing';
	}

	return (
		<Spin spinning={text === NO_INFO_TEXT} indicator={<LoadingOutlined />}>
			<div className={`${className} ${text === NO_INFO_TEXT ? null : text.toLowerCase()} ml-auto text-white border-0 text-xs rounded-full px-3 py-1 whitespace-nowrap truncate h-min w-min`}>
				{text}
			</div>
		</Spin>
	);
};

export default styled(PassingInfoTag)`
	&.passing {
		background-color: green_primary;
	}

	&.failing {
		background-color: red_primary;
	}
`;
