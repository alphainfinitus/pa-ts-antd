// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

interface Props {
	className?: string;
	text: string;
	bgColor?: string;
}

const HelperTooltip = ({ className, text, bgColor='#E5007A' } : Props) => {
	return (
		<Tooltip color={bgColor} title={ text }>
			<InfoCircleOutlined className={className} />
		</Tooltip>
	);
};

export default HelperTooltip;