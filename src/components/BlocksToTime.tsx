// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Tooltip } from 'antd';
import BN from 'bn.js';
import React from 'react';
import { useBlockTime } from 'src/hooks';
import blockToTime from 'src/util/blockToTime';

interface Props {
	blocks: number | BN;
	className?: string
}

const DivContent = styled.div`
	font-size: xs;
	color: black_text;
`;

const BlocksToTime = ({ blocks, className }:Props ) => {
	const { blocktime } = useBlockTime();

	return (
		<Tooltip color='#E5007A' className={className} title={<DivContent>{`${blocks} blocks`}</DivContent>}>
			<div>{blockToTime(blocks, blocktime)}</div>
		</Tooltip>
	);
};

export default BlocksToTime;
