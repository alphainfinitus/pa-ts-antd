// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import BN from 'bn.js';
import { chainProperties } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

export default function blockToDays (blocks: BN |  number, blocktime?: number ): number {
	const network = getNetwork();

	if (!blocktime) {
		blocktime = chainProperties?.[network]?.blockTime / 1000;
	} else {
		blocktime = blocktime / 1000;
	}

	if (typeof blocks !== 'number') {
		blocks = blocks.toNumber();
	}

	let time = (blocks * blocktime) / (3600*24);
	time = time >= 1 ? Math.floor(time) : Math.round((time + Number.EPSILON) * 100) / 100;

	return time;
}
