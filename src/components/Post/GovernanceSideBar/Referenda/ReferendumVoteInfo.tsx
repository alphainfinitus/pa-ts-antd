// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { DeriveReferendumVote } from '@polkadot/api-derive/types';
import { Balance } from '@polkadot/types/interfaces';
import { Spin } from 'antd';
import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useMemo,useRef,useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { getFailingThreshold, getPassingThreshold } from 'src/polkassemblyutils';
import { LoadingStatusType, VoteThreshold } from 'src/types';
import GovSidebarCard from 'src/ui-components/GovSidebarCard';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import Loader from 'src/ui-components/Loader';
import PassingInfoTag from 'src/ui-components/PassingInfoTag';
import VoteProgress from 'src/ui-components/VoteProgress';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';

interface Props {
	className?: string
	referendumId: number
	threshold?: VoteThreshold
	setLastVote: React.Dispatch<React.SetStateAction<string | null | undefined>>
}

const ZERO = new BN(0);

const sizing = ['0.1x', '1x', '2x', '3x', '4x', '5x', '6x'];
const LOCKS = [1, 10, 20, 30, 40, 50, 60];

const ReferendumVoteInfo = ({ className, referendumId, threshold, setLastVote }: Props) => {
	const canFetch = useRef(true);
	const { api, apiReady } = useContext(ApiContext);
	const [turnout, setTurnout] = useState(ZERO);
	const [totalIssuance, setTotalIssuance] = useState(ZERO);
	const [ayeVotes, setAyeVotes] = useState(ZERO);
	const [nayVotes, setNayVotes] = useState(ZERO);
	const [votedAccounts, setVotedAccounts] = useState([{ 'accountId': '', 'balance': '','label': '', 'voted': '' }]);
	const [nayVotesWithoutConviction, setNayVotesWithoutConviction] = useState(ZERO);
	const [ayeVotesWithoutConviction, setAyeVotesWithoutConviction] = useState(ZERO);
	const [isPassing, setIsPassing] = useState<boolean | null>(null);
	const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>({ isLoading: true, message:'Loading votes' });
	const turnoutPercentage = useMemo( () => {
		if (totalIssuance.isZero()) {
			return 0;
		}
		// BN doens't handle floats. If we devide a number by a bigger number (12/100 --> 0.12), the result will be 0
		// therefore, we first multiply by 10 000, which gives (120 000/100 = 1200) go to Number which supports floats
		// and devide by 100 to have percentage --> 12.00%
		return turnout.muln(10000).div(totalIssuance).toNumber()/100;
	} , [turnout, totalIssuance]);
	const [voteInfo, setVoteInfo] = useState<any | null>(null);
	const turnoutPercentage2 = useMemo( () => {
		if (totalIssuance.isZero()) {
			return 0;
		}
		// BN doens't handle floats. If we devide a number by a bigger number (12/100 --> 0.12), the result will be 0
		// therefore, we first multiply by 10 000, which gives (120 000/100 = 1200) go to Number which supports floats
		// and devide by 100 to have percentage --> 12.00%
		return voteInfo?.turnout.muln(10000).div(totalIssuance).toNumber()/100;
	} , [voteInfo?.turnout, totalIssuance]);

	const { addresses } = useContext(UserDetailsContext);

	const getBalance = (balance: Balance, convictions: number) => {
		const votedBalance = balance.muln(LOCKS[convictions]).div(new BN(10));
		return formatBnBalance(votedBalance, {});
	};

	const getThreshold = useMemo(
		(): BN => {
			if (!threshold || isPassing === null) return ZERO;
			// if the referendum is passing, we're interesed in the failing threshold
			if (isPassing) {
				const res = getFailingThreshold({ ayes: ayeVotes, ayesWithoutConviction: ayeVotesWithoutConviction, threshold, totalIssuance });
				return res.isValid && res.failingThreshold ? res.failingThreshold : ZERO;
			} else {
				const res = getPassingThreshold({ nays: nayVotes, naysWithoutConviction: nayVotesWithoutConviction, threshold, totalIssuance });
				return res.isValid && res.passingThreshold ? res.passingThreshold : ZERO;
			}
		},
		[ayeVotes, ayeVotesWithoutConviction, isPassing, nayVotes, nayVotesWithoutConviction, threshold, totalIssuance]
	);
	const getThreshold2 = useMemo(
		() => {
			if (!voteInfo?.vote_threshold || voteInfo?.isPassing === null) return ZERO;
			// if the referendum is passing, we're interested in the failing threshold
			if (voteInfo?.isPassing) {
				const res = getFailingThreshold({
					ayes: voteInfo?.aye_amount,
					ayesWithoutConviction: voteInfo?.aye_without_conviction,
					threshold: voteInfo?.vote_threshold,
					totalIssuance
				});
				return res.isValid && res.failingThreshold ? res.failingThreshold : ZERO;
			} else {
				const res = getPassingThreshold({
					nays: voteInfo?.nay_amount,
					naysWithoutConviction: voteInfo?.nay_without_conviction,
					threshold: voteInfo?.vote_threshold,
					totalIssuance
				});
				return res.isValid && res.passingThreshold ? res.passingThreshold : ZERO;
			}
		},
		[voteInfo?.aye_amount, voteInfo?.aye_without_conviction, voteInfo?.isPassing, voteInfo?.nay_amount, voteInfo?.nay_without_conviction, voteInfo?.vote_threshold, totalIssuance]
	);

	const fetchVoteInfo = useCallback(() => {
		if (canFetch.current) {
			fetch(`https://${getNetwork()}.api.subscan.io/api/scan/democracy/referendum`, { body: JSON.stringify({ referendum_index: referendumId }), method: 'POST' }).then(async (res) => {
				try {
					const response = await res.json();
					const info = response?.data?.info;
					if (info) {
						if (info.status === 'notPassed'){
							info.isPassing = false;
						} else {
							info.isPassing = true;
						}
						info.aye_amount = new BN(info.aye_amount);
						info.aye_without_conviction = new BN(info.aye_without_conviction);
						info.nay_amount = new BN(info.nay_amount);
						info.nay_without_conviction = new BN(info.nay_without_conviction);
						info.turnout = new BN(info.turnout);
						setVoteInfo(info);
					}
				} catch (error) {
					setVoteInfo(null);
				}
			}).catch(() => {
				setVoteInfo(null);
			});
		}
	}, [referendumId]);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		api.derive.democracy.referendums((referendums) => {
			const referendum = referendums.filter(re => re.index.toNumber() === referendumId)[0];

			if (referendum) {
				setIsPassing(referendum.isPassing);
				const totalAye: BN = referendum.allAye.reduce((acc: BN, curr: DeriveReferendumVote) => {
					return acc.add(new BN(curr.balance));
				}, ZERO);
				const totalNay: BN = referendum.allNay.reduce((acc: BN, curr: DeriveReferendumVote) => {
					return acc.add(new BN(curr.balance));
				}, ZERO);

				setNayVotesWithoutConviction(totalNay);
				setAyeVotesWithoutConviction(totalAye);

				let voteObj: any = {};
				const acc: any = [];

				if(addresses){
					referendum.votes.forEach(vote => {
						if(addresses.includes(vote.accountId.toHuman())) {
							voteObj = { 'accountId': vote.accountId.toHuman(),'balance': getBalance(vote.balance, vote.vote.conviction.toNumber()), 'label': `${sizing[vote.vote.conviction.toNumber()]}${vote.isDelegating ? '/d' : ''} - `, 'voted': vote.vote.isAye ? 'aye' : 'nay' };
							acc.push(voteObj);
						}
					});
					setVotedAccounts(acc);
				}
			}
		}).then( unsub => {unsubscribe = unsub;})
			.catch(console.error);

		return () => unsubscribe && unsubscribe();
	}, [api, apiReady, referendumId, addresses]);

	useEffect(() => {
		if(votedAccounts.length>0){
			setLastVote(votedAccounts[votedAccounts.length - 1].voted == '' ? null : votedAccounts[votedAccounts.length - 1].voted);
		}
	}, [setLastVote, votedAccounts]);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		api.query.democracy.referendumInfoOf(referendumId, (info) => {
			const _info = info.unwrapOr(null);

			if (_info?.isOngoing){
				setAyeVotes(_info?.asOngoing.tally.ayes);
				setNayVotes(_info?.asOngoing.tally.nays);
				setTurnout(_info?.asOngoing.tally.turnout);
			} else {
				fetchVoteInfo();
				canFetch.current = false;
			}

			setLoadingStatus({ isLoading: false, message: '' });
		})
			.then( unsub => {unsubscribe = unsub;})
			.catch(console.error);

		return () => unsubscribe && unsubscribe();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [api, apiReady, referendumId]);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		api.query.balances.totalIssuance((result) => {
			setTotalIssuance(result);
		})
			.then( unsub => {unsubscribe = unsub;})
			.catch(console.error);

		return () => unsubscribe && unsubscribe();
	},[api, apiReady]);

	return (
		<>
			{!voteInfo ?
				<GovSidebarCard className={className}>
					<Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
						<div className="flex justify-between mb-7">
							<h6 className='dashboard-heading'>Voting Status</h6>
						</div>

						{<div className='flex items-center'>
							{
								isPassing === null
									? <Loader className={'my-3'} text={'Loading vote progress'} timeout={90000} timeoutText='Vote calculation failed'/>
									: <VoteProgress
										ayeVotes={ayeVotes}
										className='vote-progress'
										isPassing={isPassing}
										threshold={getThreshold}
										nayVotes={nayVotes}
										thresholdType={threshold}
									/>
							}

							<div className='flex-1 flex flex-col justify-between mx-auto p-9 gap-y-3'>
								<div className='mb-auto flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium'>Turnout {turnoutPercentage > 0 && <span className='turnoutPercentage'>({turnoutPercentage}%)</span>}</div>
									<div className='text-navBlue'>{formatBnBalance(turnout, { numberAfterComma: 2, withUnit: true })}</div>
								</div>

								<div className='mb-auto flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Aye <HelperTooltip className='ml-2' text='Aye votes without taking conviction into account'/></div>
									<div className='text-navBlue'>{formatBnBalance(ayeVotesWithoutConviction, { numberAfterComma: 2, withUnit: true })}</div>
								</div>

								<div className='flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Nay <HelperTooltip className='ml-2' text='Nay votes without taking conviction into account'/></div>
									<div className='text-navBlue'>{formatBnBalance(nayVotesWithoutConviction, { numberAfterComma: 2, withUnit: true })}</div>
								</div>
							</div>
						</div>
						}
					</Spin>
				</GovSidebarCard>
				:
				<GovSidebarCard className={className}>
					<Spin spinning={loadingStatus.isLoading} indicator={<LoadingOutlined />}>
						<div className="flex justify-between mb-7">
							<h6 className='dashboard-heading'>Voting Status</h6>
							<PassingInfoTag isPassing={voteInfo?.isPassing}/>
						</div>

						<div className="flex justify-between">
							<VoteProgress
								ayeVotes={voteInfo?.aye_amount}
								className='vote-progress'
								isPassing={voteInfo?.isPassing}
								threshold={getThreshold2}
								nayVotes={voteInfo?.nay_amount}
								thresholdType={voteInfo?.vote_threshold}
							/>

							<div className='flex-1 flex flex-col justify-between ml-12 py-9'>
								<div className='mb-auto flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium'>Turnout {turnoutPercentage2 > 0 && <span className='turnoutPercentage'>({turnoutPercentage2}%)</span>}</div>
									<div className='text-navBlue'>{formatBnBalance(voteInfo?.turnout, { numberAfterComma: 2, withUnit: true })}</div>
								</div>

								<div className='mb-auto flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Aye <HelperTooltip className='ml-2' text='Aye votes without taking conviction into account'/></div>
									<div className='text-navBlue'>{formatBnBalance(voteInfo?.aye_without_conviction, { numberAfterComma: 2, withUnit: true })}</div>
								</div>

								<div className='flex items-center'>
									<div className='mr-auto text-sidebarBlue font-medium flex items-center'>Nay <HelperTooltip className='ml-2' text='Nay votes without taking conviction into account'/></div>
									<div className='text-navBlue'>{formatBnBalance(voteInfo?.nay_without_conviction, { numberAfterComma: 2, withUnit: true })}</div>
								</div>
							</div>
						</div>
					</Spin>
				</GovSidebarCard>}
		</>
	);
};

export default ReferendumVoteInfo;
