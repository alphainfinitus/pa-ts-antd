// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import formatBnBalance from 'src/util/formatBnBalance';

interface Props {
	ayeVotes: BN,
	className?: string,
	isPassing: boolean,
	nayVotes: BN,
	threshold: BN,
	thresholdType?: string | null
}

const bnToIntBalance = function (bn: BN): number{
	return  Number(formatBnBalance(bn, { numberAfterComma: 2, withThousandDelimitor: false }));
};

// const bnToStringBalanceDelimitor = function (bn: BN): string{
// return  formatBnBalance(bn, { numberAfterComma: 2, withThousandDelimitor: true });
// };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VoteProgress = ({ ayeVotes, className, isPassing, nayVotes, threshold, thresholdType }: Props) => {

	// const thresholdNumber = bnToIntBalance(threshold);
	const ayeVotesNumber = bnToIntBalance(ayeVotes);
	const nayVotesNumber = bnToIntBalance(nayVotes);
	const totalVotesNumber = bnToIntBalance(ayeVotes.add(nayVotes));
	// const totalVotesNumberDivider = isPassing
	// ? bnToIntBalance(ayeVotes.add(threshold))
	// : bnToIntBalance(nayVotes.add(threshold)) || 1;
	// const thresholdPercent = isPassing
	// ? (1-thresholdNumber/totalVotesNumberDivider)*100
	// : thresholdNumber / totalVotesNumberDivider*100;
	const ayePercent = ayeVotesNumber/totalVotesNumber*100;
	const nayPercent = 100 - ayePercent;

	return (
		<div className={`${className} flex flex-col items-center text-white text-base`}>
			<div id="bigCircle" className={`${ayeVotesNumber >= nayVotesNumber ? 'bg-aye_green' : 'bg-nay_red'} rounded-full h-[110px] w-[110px] flex items-center justify-center z-10`}>
				{
					(ayeVotesNumber == 0 && nayVotesNumber == 0) ? '0' : ayeVotesNumber >= nayVotesNumber ? (ayePercent).toFixed(1) : ((nayPercent).toFixed(1))
				}%
			</div>
			<div id="smallCircle" className={`${ayeVotesNumber < nayVotesNumber ? 'bg-aye_green' : 'bg-nay_red'} -mt-8 border-2 border-white rounded-full h-[75px] w-[75px] flex items-center justify-center z-20`}>
				{
					(ayeVotesNumber == 0 && nayVotesNumber == 0) ? '0' : ayeVotesNumber < nayVotesNumber ? (ayePercent).toFixed(1) : (nayPercent).toFixed(1)
				}%
			</div>
		</div>
	);
};

export default VoteProgress;