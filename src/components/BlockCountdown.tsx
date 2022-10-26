// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Tooltip } from 'antd';
import BN from 'bn.js';
import React from 'react';
import { useBlockTime } from 'src/hooks';
import useCurrentBlock from 'src/hooks/useCurrentBlock';
import blockToTime from 'src/util/blockToTime';

interface Props {
	className?: string
	endBlock: number;
}

const SpanContent = styled.span`
	font-size: xs;
	color: black_text;
`;

const BlockCountdown = ({ className, endBlock }:Props ) => {
	const ZERO = new BN(0);
	const currentBlock = useCurrentBlock() || ZERO;
	const blocksRemaining = endBlock - currentBlock.toNumber();
	const { blocktime } = useBlockTime();

	return (
		blocksRemaining !== endBlock && blocksRemaining > 0
			?
			<Tooltip title={<SpanContent>{`#${endBlock}`}</SpanContent>}>
				<span className={`${className} blockCountdown`}>{ blockToTime(blocksRemaining, blocktime)}</span>
			</Tooltip>
			: <>#{endBlock}</>
	);
};

export default BlockCountdown;
