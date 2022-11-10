// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Col, Row } from 'antd';
import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ApiContext } from 'src/context/ApiContext';
import HelperTooltip from 'src/ui-components/HelperTooltip';
import { PostEmptyState } from 'src/ui-components/UIStates';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';

import Address from '../../../../ui-components/Address';
import Card from '../../../../ui-components/Card';
import Loader from '../../../../ui-components/Loader';

interface Props {
	onChainId: string
	who?: string;
}

const Median = (data: any, members: string[]): [BN, BN, string, string] => {
	let median = new BN(0);
	let findersFee = new BN(0);
	let receiver = '';
	let finder = '';

	if (data?.tips?.length > 0) {
		const values: BN[] = data.tips.map(([, value]: [string, BN]) => value).sort((a: BN, b: BN) => new BN(a).cmp(new BN(b)));
		const midIndex = Math.floor(values.length / 2);
		median = values.length
			? values.length % 2
				? values[midIndex]
				: new BN(values[midIndex - 1]).add(new BN(values[midIndex])).divn(2)
			: new BN(0);
		receiver = data.who;
		finder = data.finder;
		if (data.finder != data.who && !members.includes(data.finder) && median != new BN(0)) {
			findersFee = new BN(median).divn(5); // 20% of median value
			median = new BN(median).sub(findersFee);

		}
	}

	return [median, findersFee, finder, receiver];
};
const Median2 = (list: any[]): [BN] => {
	let median = new BN(0);
	let findersFee = new BN(0);

	if(list&&list.length>0){
		const values: BN[] = list.map((value: any) => {
			return new BN(value?.amount);
		}).sort((a: BN, b: BN) => new BN(a).cmp(new BN(b)));
		const midIndex = Math.floor(values.length / 2);
		median = values.length
			? values.length % 2
				? values[midIndex]
				: new BN(values[midIndex - 1]).add(new BN(values[midIndex])).divn(2)
			: new BN(0);
		if (median != new BN(0)) {
			findersFee = new BN(median).divn(5); // 20% of median value
			median = new BN(median).sub(findersFee);
		}
	}
	return [median];
};

const TipInfo = ({ onChainId, who }: Props) => {
	const canFetch = useRef(true);
	const { api, apiReady } = useContext(ApiContext);
	const [tips, setTips] = useState<any>(null);
	const [isTippersLoading, setIsTippersLoading] = useState(true);
	const [members, setMembers] = useState<string[]>([]);
	const [median, setMedian] = useState<BN>(new BN(0));
	const [median2, setMedian2] = useState<BN>(new BN(0));
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [findersFee, setFindersFee] = useState<BN>(new BN(0));
	//eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [finder, setFinder] = useState<string>('');
	//eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [receiver, setReceiver] = useState<string>('');
	const [tippers, setTippers] = useState<any[]>([]);

	const fetchTippers = useCallback(() => {
		if (canFetch.current){
			// eslint-disable-next-line quotes
			fetch(`https://${getNetwork()}.api.subscan.io/api/scan/treasury/tippers`, { body: JSON.stringify({ hash: onChainId }) as unknown as BodyInit, method: 'POST' }).then(async (res) => {
				try {
					const response = await res.json();
					setTippers(response?.data?.list);
					const [adjustedMedian] = Median2(response?.data?.list);
					setMedian2(adjustedMedian);
				} catch (error) {
					setTippers([]);
				}
			}).catch(() => {
				setTippers([]);
			});
		}
	}, [onChainId]);

	useEffect(() => {
		if (!api || !apiReady) {
			return;
		}
		let cancel = false;
		api.query.council.members().then((members) => {
			if (cancel) return;
			setMembers(members?.map(member => member.toString()));
		});
		return () => {
			cancel = true;
		};
	},[api, apiReady]);

	useEffect(() => {
		if (!api || !apiReady || members.length === 0) return;
		let cancel = false;
		api.query.tips.tips.multi([onChainId]).then(tip => {
			if (cancel) return;
			if (!tip[0]?.toJSON()) {
				fetchTippers();
			}
			setTips(tip[0]?.toJSON());
			setIsTippersLoading(false);
			const [adjustedMedian, findersFee, finder, receiver] = Median(tip[0]?.toJSON(), members);
			setMedian(adjustedMedian);
			setFindersFee(findersFee);
			setReceiver(receiver);
			setFinder(finder);

		}).catch(() => {
			fetchTippers();
		});

		return () => {
			canFetch.current = false;
			cancel = true;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [api, apiReady, onChainId, members]);

	const pendingTippers = members.filter(item => !tips?.tips.find((tip: any[]) => tip[0] == item));

	return (
		<>
			{tips?.tips.length > 0 ?
				<Card className='flex flex-col gap-y-7'>
					<h3 className='flex items-center gap-x-2 text-lg tracking-wide text-sidebarBlue font-medium'>Receiver of Final Tip<HelperTooltip className='text-sm' text='The final value of the tip is decided based on the median of all tips issued by the tippers' /></h3>
					<Row className='flex items-center justify-between'>
						<Col>
							<Address address={who || ''} />
						</Col>
						<Col>
							{formatBnBalance(median, { numberAfterComma: 2, withUnit: true })}
						</Col>
					</Row>
					<h3 className='flex items-center gap-x-2 text-lg tracking-wide text-sidebarBlue font-medium'>Tippers <HelperTooltip className='text-sm' text='Amount tipped by an individual/organization' /></h3>
					<div className='flex flex-col gap-y-5'>
						{tips.tips.map((tip: any[]) =>
							<Row key={tip[0]} className='flex items-center justify-between'>
								<Col>
									<Address address={tip[0]} />
								</Col>
								<Col className='text-sm font-medium text-navBlue'>
									{formatBnBalance(tip[1], { numberAfterComma: 2, withUnit: true })}
								</Col>
							</Row>
						)}

					</div>
					<div className="flex flex-col gap-y-5">
						{pendingTippers.map((tip: string) =>
							<Row key={tip} className='flex items-center justify-between'>
								<Col>
									<Address address={tip} />
								</Col>
								<Col>
									Pending
								</Col>
							</Row>
						)}
					</div>
				</Card>
				: isTippersLoading ? <Loader text={'Requesting Tippers'} /> : tippers?.length > 0?
					<Card className='flex flex-col gap-y-7'>
						<h3 className='flex items-center gap-x-2 text-lg tracking-wide text-sidebarBlue font-medium'>Receiver of Final Tip<HelperTooltip className='text-sm' text='The final value of the tip is decided based on the median of all tips issued by the tippers' /></h3>
						<Row className='flex items-center justify-between'>
							<Col>
								<Address address={who || ''} />
							</Col>
							<Col>
								{formatBnBalance(median2, { numberAfterComma: 2, withUnit: true })}
							</Col>
						</Row>
						<h3 className='flex items-center gap-x-2 text-lg tracking-wide text-sidebarBlue font-medium'>Tippers <HelperTooltip className='text-sm' text='Amount tipped by an individual/organization' /></h3>
						<div className='flex flex-col gap-y-5'>
							{tippers?.map((tip: any, index) => {
								if (!tip?.rewarder){
									return null;
								}
								return (
									<Row key={index} className='flex items-center justify-between'>
										<Col>
											<Address address={tip?.rewarder?.address} />
										</Col>
										<Col className='text-sm font-medium text-navBlue'>
											{tip?.amount?formatBnBalance(tip?.amount, {
												numberAfterComma: 2,
												withUnit: true
											}):<span className='not-tipped'>Not Tipped</span>}
										</Col>
									</Row>
								);
							}
							)}
						</div>
					</Card>
					:<PostEmptyState />}
		</>
	);
};

export default TipInfo;