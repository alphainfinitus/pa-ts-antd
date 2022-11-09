// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';
import { BN_MILLION, BN_ZERO, u8aConcat, u8aToHex } from '@polkadot/util';
import { Divider, Progress } from 'antd';
import BN from 'bn.js';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import { chainProperties } from 'src/global/networkConstants';
import subscanApiHeaders from 'src/global/subscanApiHeaders';
import { useBlockTime } from 'src/hooks';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import blockToDays from 'src/util/blockToDays';
import blockToTime from 'src/util/blockToTime';
import fetchTokenToUSDPrice from 'src/util/fetchTokenToUSDPrice';
import formatBnBalance from 'src/util/formatBnBalance';
import formatUSDWithUnits from 'src/util/formatUSDWithUnits';
import getNetwork from 'src/util/getNetwork';

const EMPTY_U8A_32 = new Uint8Array(32);

interface Result {
	value?: Balance;
	burn?: BN;
	spendPeriod: BN;
	treasuryAccount: Uint8Array;
}

interface Props{
	inTreasuryProposals?: boolean
}

const NETWORK = getNetwork();

const TreasuryOverview = ({ inTreasuryProposals }:Props) => {
	const { api, apiReady } = useContext(ApiContext);
	const [currentBlock, setCurrentBlock] = useState<BN>(new BN(0));
	const [treasuryBalance, setTreasuryBalance] = useState<
		DeriveBalancesAccount | undefined
	>(undefined);

	const { blocktime } = useBlockTime();

	const [result, setResult] = useState<Result>(() => ({
		spendPeriod: BN_ZERO,
		treasuryAccount: u8aConcat('modl', 'py/trsry', EMPTY_U8A_32).subarray(
			0,
			32
		)
	}));

	const [resultValue, setResultValue] = useState<string | undefined>(undefined);
	const [resultBurn, setResultBurn] = useState<string | undefined>(undefined);
	const [availableUSD, setAvailableUSD] = useState<string>('');
	const [nextBurnUSD, setNextBurnUSD] = useState<string>('');
	const [currentTokenPrice, setCurrentTokenPrice] = useState<string>('');
	const [priceWeeklyChange, setPriceWeeklyChange] = useState<string | number>();
	const [spendPeriod, setSpendPeriod] = useState<{
		total: number;
		days: string;
		hours: string;
	}>();
	const [spendPeriodPercentage, setSpendPeriodPercentage] = useState<number>();

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		api.derive.chain.bestNumber((number) => {
			setCurrentBlock(number);
		});

		api.derive.balances
			?.account(u8aToHex(result.treasuryAccount))
			.then((treasuryBalance) => {
				setTreasuryBalance(treasuryBalance);
			});

		if (treasuryBalance) {
			setResult(() => ({
				burn:
					treasuryBalance.freeBalance.gt(BN_ZERO) &&
					!api.consts.treasury.burn.isZero()
						? api.consts.treasury.burn
							.mul(treasuryBalance.freeBalance)
							.div(BN_MILLION)
						: BN_ZERO,
				spendPeriod: api.consts.treasury
					? api.consts.treasury.spendPeriod
					: BN_ZERO,
				treasuryAccount: u8aConcat(
					'modl',
					api.consts.treasury && api.consts.treasury.palletId
						? api.consts.treasury.palletId.toU8a(true)
						: 'py/trsry',
					EMPTY_U8A_32
				),
				value: treasuryBalance.freeBalance.gt(BN_ZERO)
					? treasuryBalance.freeBalance
					: undefined
			}));

			if (result.value) {
				setResultValue(result.value.toString());
			}

			if (result.burn) {
				setResultBurn(result.burn.toString());
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [api, apiReady, treasuryBalance, currentBlock]);

	// set availableUSD and nextBurnUSD whenever they or current price of the token changes
	useEffect(() => {
		let cancel = false;
		if (cancel || !currentTokenPrice) return;

		if(resultValue) {
			// replace spaces returned in string by format function
			const availableVal: number = parseFloat(formatBnBalance(
				resultValue.toString(),
				{
					numberAfterComma: 2,
					withThousandDelimitor: false,
					withUnit: false
				}
			));

			if(availableVal != 0) {
				setAvailableUSD(formatUSDWithUnits((availableVal * Number(currentTokenPrice)).toString()));
			}
		}

		if(resultBurn) {
			// replace spaces returned in string by format function
			const burnVal: number = parseFloat(formatBnBalance(
				resultBurn.toString(),
				{
					numberAfterComma: 2,
					withThousandDelimitor: false,
					withUnit: false
				}
			));

			if(burnVal != 0) {
				setNextBurnUSD(formatUSDWithUnits((burnVal * Number(currentTokenPrice)).toString()));
			}
		}

		return () => { cancel = true; };
	}, [resultValue, resultBurn, currentTokenPrice]);

	// fetch current price of the token
	useEffect(() => {
		let cancel = false;
		if(cancel) return;

		fetchTokenToUSDPrice(1).then((formattedUSD) => {
			setCurrentTokenPrice(parseFloat(formattedUSD).toFixed(2));
		});

		return () => {cancel = true;};
	}, []);

	// fetch a week ago price of the token and calc priceWeeklyChange
	useEffect(() => {
		let cancel = false;
		if(cancel || !currentTokenPrice) return;

		async function fetchWeekAgoTokenPrice() {
			if (cancel) return;
			const weekAgoDate = moment().subtract(7,'d').format('YYYY-MM-DD');

			try {
				const response = await fetch(
					`https://${NETWORK === 'kilt' ? 'spiritnet' : NETWORK}.api.subscan.io/api/scan/price/history`,
					{
						body: JSON.stringify({
							end: weekAgoDate,
							start: weekAgoDate
						}),
						headers: subscanApiHeaders,
						method: 'POST'
					}
				);
				const responseJSON = await response.json();
				if (responseJSON['message'] == 'Success') {
					const weekAgoPrice = responseJSON['data']['average'];
					const currentTokenPriceNum : number = parseFloat(currentTokenPrice);
					const weekAgoPriceNum : number = parseFloat(weekAgoPrice);
					const percentChange = ((currentTokenPriceNum - weekAgoPriceNum) / weekAgoPriceNum) * 100;
					setPriceWeeklyChange(parseFloat(percentChange.toFixed(2)));
				}
			} catch(err) {
				setPriceWeeklyChange('N/A');
			}
		}

		fetchWeekAgoTokenPrice();
		return () => {cancel = true;};
	}, [currentTokenPrice]);

	useEffect(() => {
		if (!api || !apiReady || currentBlock.isZero()) {
			return;
		}

		const totalSpendPeriod: number = blockToDays(result.spendPeriod.toNumber(), blocktime);
		const spendPeriodElapsed: number = blockToDays(currentBlock.toNumber() % (result.spendPeriod.toNumber()), blocktime);
		// const spendPeriodRemaining: number = totalSpendPeriod - spendPeriodElapsed;
		const time = blockToTime(currentBlock.toNumber() % (result.spendPeriod.toNumber()), blocktime);
		const timeArr = time.split(' ');
		const days = timeArr[0].replace('d', '');
		const hours = timeArr[1].replace('h', '');
		setSpendPeriod({
			days,
			hours,
			total: totalSpendPeriod
		});

		// spendPeriodElapsed/totalSpendPeriod for opposite
		const percentage = ((spendPeriodElapsed/totalSpendPeriod) * 100).toFixed(0);
		setSpendPeriodPercentage(parseFloat(percentage));
	}, [api, apiReady, currentBlock, blocktime, result.spendPeriod]);

	return (
		<div className="grid grid-rows-2 grid-flow-col gap-4 lg:gap-0 lg:flex">
			{/* Available */}
			<div className="flex-1 lg:mr-7 bg-white drop-shadow-md p-3 lg:p-6 rounded-md">
				<div className="text-navBlue text-xs flex items-center">
					<span className="mr-2">
						Available
					</span>

					<HelperTooltip
						text='Funds collected through a portion of block production rewards, transaction fees, slashing, staking inefficiencies, etc.'
					/>
				</div>
				<div className="mt-3 text-sidebarBlue font-medium">
					{result.value ?
						<span>
							{formatUSDWithUnits(formatBnBalance(
								result.value.toString(),
								{
									numberAfterComma: 0,
									withThousandDelimitor: false,
									withUnit: false
								}
							))} <span className='text-navBlue'>{chainProperties[NETWORK]?.tokenSymbol}</span>
						</span>
						: <LoadingOutlined />
					}
				</div>
				<Divider className='my-3' />
				<div>
					<span className='mr-2 text-sidebarBlue font-medium'>
						{availableUSD
							? `~ $${availableUSD}`
							: <LoadingOutlined />
						}
					</span>
				</div>
			</div>

			{/* CurrentPrice */}
			<div className="flex-1 lg:mr-7 bg-white drop-shadow-md p-3 lg:p-6 rounded-md">
				<div className="text-navBlue text-xs">Current Price of {chainProperties[NETWORK].tokenSymbol}</div>
				<div className="mt-3 text-sidebarBlue font-medium">
					{currentTokenPrice && !isNaN(Number(currentTokenPrice))
						? `$${currentTokenPrice}`
						: <LoadingOutlined />
					}
				</div>
				<Divider className='my-3' />
				<div className="flex items-center text-sidebarBlue font-medium">
					{priceWeeklyChange ?
						<>
							<span>Weekly <span className='hidden xl:inline-block'>Change</span></span><span className='ml-2'>{Math.abs(Number(priceWeeklyChange))}%</span>
							{priceWeeklyChange < 0 ? <CaretDownOutlined color='red' /> : <CaretUpOutlined color='green' /> }
						</>
						:
						<LoadingOutlined />
					}
				</div>
			</div>

			{/* Spend Period */}
			{!inTreasuryProposals &&  <div className="flex-1 lg:mr-7 bg-white drop-shadow-md p-3 lg:p-6 rounded-md">
				<div className="text-navBlue text-xs flex items-center">
					<span className="mr-2">
						Spend Period
					</span>

					<HelperTooltip
						text='Funds held in the treasury can be spent by making a spending proposal that, if approved by the Council, will enter a spend period before distribution, it is subject to governance, with the current default set to 24 days.'
					/>
				</div>

				<div className="mt-3 text-sidebarBlue font-medium">
					{spendPeriod?.total
						? <span>
							<span>{spendPeriod.days} </span>
							<span className='text-navBlue'>days </span>
							<span>{spendPeriod.hours} </span>
							<span className='text-navBlue'>hrs </span>
							<span className="text-navBlue text-xs"> / {spendPeriod.total} days </span>
						</span>
						: <LoadingOutlined />
					}
				</div>
				<Divider className='my-3' />
				<div>
					<Progress percent={!isNaN(Number(spendPeriodPercentage)) ? spendPeriodPercentage : 0} strokeColor='#E5007A' size="small" />
				</div>
			</div>}

			{/* Next Burn */}
			<div className="flex-1 bg-white drop-shadow-md p-3 lg:p-6 rounded-md">
				<div className="text-navBlue text-xs flex items-center">
					<span className="mr-2">
						Next Burn
					</span>

					<HelperTooltip
						text='If the Treasury ends a spend period without spending all of its funds, it suffers a burn of a percentage of its funds.'
					/>
				</div>

				<div className="mt-3 text-sidebarBlue font-medium">
					{result.burn ? (
						<span>
							{formatUSDWithUnits(formatBnBalance(
								result.burn.toString(),
								{
									numberAfterComma: 0,
									withThousandDelimitor: false,
									withUnit: false
								}
							))} <span className='text-navBlue'>{chainProperties[NETWORK]?.tokenSymbol}</span>
						</span>
					) :
						<LoadingOutlined />
					}
				</div>
				<Divider className='my-3' />
				<div>
					<span className='mr-2 text-sidebarBlue font-medium'>
						{nextBurnUSD
							? `~ $${nextBurnUSD}`
							: <LoadingOutlined />
						}
					</span>
				</div>
			</div>
		</div>
	);
};

export default TreasuryOverview;