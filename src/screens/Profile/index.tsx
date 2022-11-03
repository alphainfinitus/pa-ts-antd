// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import { DeriveAccountFlags, DeriveAccountInfo, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedExtension } from '@polkadot/extension-inject/types' ;
import { stringToHex } from '@polkadot/util';
import { Button, Col, Divider, Form, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useParams,useSearchParams } from 'react-router-dom';
import ContentForm from 'src/components/ContentForm';
import TitleForm from 'src/components/TitleForm';
import queueNotification from 'src/ui-components/QueueNotification';

import Balance from '../../components/Balance';
import { ApiContext } from '../../context/ApiContext';
import { useAboutLazyQuery, useChangeAboutMutation } from '../../generated/graphql';
import { APPNAME } from '../../global/appName';
import { NotificationStatus } from '../../types';
import AddressComponent from '../../ui-components/Address';
import FilteredError from '../../ui-components/FilteredError';
import Loader from '../../ui-components/Loader';
import Markdown from '../../ui-components/Markdown';
import getEncodedAddress from '../../util/getEncodedAddress';
import getNetwork from '../../util/getNetwork';
import SetOnChainIdentityButton from '../Settings/setOnChainIdentityButton';
import CouncilVotes from './CouncilVotes';

interface Props {
	className?: string
}

const CouncilEmoji = () => <span aria-label="council member" className='councilMember' role="img">👑</span>;

const network = getNetwork();

const Profile = ({ className }: Props): JSX.Element => {
	const [searchParams] = useSearchParams();
	const params = useParams();
	const address = params.address || '' ;
	const username = params.username || '';
	const council = searchParams.get('council') === 'true';

	// { data, loading, error }
	const [refetch, aboutQueryResult] = useAboutLazyQuery({
		variables: {
			address,
			network
		}
	});
	useEffect(() => {
		refetch();
	}, [refetch]);
	const aboutDescription = aboutQueryResult?.data?.about?.description;
	const aboutTitle = aboutQueryResult?.data?.about?.title;

	const { api, apiReady } = useContext(ApiContext);
	const [identity, setIdentity] = useState<DeriveAccountRegistration | null>(null);
	const [flags, setFlags] = useState<DeriveAccountFlags | undefined>(undefined);
	const [title, setTitle] = useState(aboutTitle || '');
	const [description, setDescription] = useState(aboutDescription || '');
	const [canEdit, setCanEdit] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const noDescription = `This page belongs to address (${address}). Only this user can edit this description and the title. If you own this address, edit this page and tell us more about yourself.`;

	const [changeAboutMutation, { loading, error }] = useChangeAboutMutation();

	useEffect(() => {
		const getAccounts = async (): Promise<undefined> => {
			const extensions = await web3Enable(APPNAME);

			if (extensions.length === 0) {
				return;
			}

			const accounts = await web3Accounts();

			if (accounts.length === 0) {
				return;
			}

			accounts.forEach((account) => {
				if (getEncodedAddress(account.address) === address) {
					setCanEdit(true);
				}
			});

			return;
		};

		getAccounts();

	}, [address]);

	useEffect(() => {

		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		let unsubscribe: () => void;

		api.derive.accounts.info(address, (info: DeriveAccountInfo) => {
			setIdentity(info.identity);
		})
			.then(unsub => { unsubscribe = unsub; })
			.catch(e => console.error(e));

		return () => unsubscribe && unsubscribe();
	}, [address, api, apiReady]);

	useEffect(() => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		if (!address) {
			return;
		}

		let unsubscribe: () => void;

		api.derive.accounts.flags(address, (result: DeriveAccountFlags) => {
			setFlags(result);
		})
			.then(unsub => { unsubscribe = unsub; })
			.catch(e => console.error(e));

		return () => unsubscribe && unsubscribe();
	}, [address, api, apiReady]);

	const judgements = identity ? identity.judgements.filter(([, judgement]): boolean => !judgement.isFeePaid) : [];
	const displayJudgements = judgements.map(([,jud]) => jud.toString()).join(', ');
	const isGood = judgements.some(([, judgement]): boolean => judgement.isKnownGood || judgement.isReasonable);
	const isBad = judgements.some(([, judgement]): boolean => judgement.isErroneous || judgement.isLowQuality);

	const color: 'brown' | 'green' | 'grey' = isGood ? 'green' : isBad ? 'brown' : 'grey';
	const icon = isGood ? <CheckCircleFilled style={{ color: color, verticalAlign:'middle' }} /> : <MinusCircleFilled style={{ color: color, verticalAlign:'middle' }} />;

	const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {setTitle(event.currentTarget.value); return event.currentTarget.value;};
	const onDescriptionChange = (data: string) => {setDescription(data); return data.length ? data : null;};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSend = async () => {
		const extensions = await web3Enable(APPNAME);

		if (!extensions || !extensions.length) {
			queueNotification({
				header: 'Failed',
				message: 'No web 3 account integration could be found. To be able to vote on-chain, visit this page on a computer with polkadot-js entension.',
				status: NotificationStatus.ERROR
			});
			return;
		}

		const accounts = await web3Accounts();

		if (accounts.length === 0) {
			queueNotification({
				header: 'Failed',
				message: 'You need at least one account in Polkadot-js extenstion to login.',
				status: NotificationStatus.ERROR
			});
			return;
		}

		let injected: InjectedExtension | undefined = undefined;

		for (let i = 0; i < accounts.length; i++) {
			if (getEncodedAddress(accounts[i].address) === address) {
				injected = await web3FromSource(accounts[i].meta.source);
			}
		}

		if (!injected) {
			queueNotification({
				header: 'Failed',
				message: 'Address not available.',
				status: NotificationStatus.ERROR
			});
			return;
		}

		const signRaw = injected && injected.signer && injected.signer.signRaw;

		if (!signRaw) {
			queueNotification({
				header: 'Failed',
				message: 'Signer not available.',
				status: NotificationStatus.ERROR
			});
			return;
		}

		const signMessage = `<Bytes>about::network:${network}|address:${address}|title:${title || ''}|description:${description || ''}|image:</Bytes>`;

		const { signature } = await signRaw({
			address,
			data: stringToHex(signMessage),
			type: 'bytes'
		});

		changeAboutMutation({
			variables: {
				address,
				description: description || '',
				image: '',
				network,
				signature,
				title:  title || ''
			}
		}).then(({ data }) => {
			queueNotification({
				header: 'SUCCESS.',
				message: data?.changeAbout?.message || 'Profile Updated.',
				status: NotificationStatus.SUCCESS
			});
			setIsEditing(false);
			refetch();
		}).catch( e => console.error(e));
	};

	if (!apiReady) {
		return <Loader text={'Initializing Connection...'} />;
	}

	return (
		<Row className={className} gutter={16}>
			<Col span={16}>
				{isEditing ? <Form className={className}>
					<h3>Update Profile</h3>
					<TitleForm
						onChange={onTitleChange}
					/>
					<ContentForm
						onChange={onDescriptionChange}
					/>

					<div className={'flex flex-col items-center mt-[3rem] justify-center'}>
						<Button
							onClick={handleSend}
							disabled={loading}
							type='primary'
							htmlType='submit'
						>
							{loading ? <>Creating</> : 'Update'}
						</Button>
					</div>
					{error?.message && <FilteredError text={error.message}/>}
				</Form> : <div className="bg-white drop-shadow-md p-3 lg:p-6 rounded-md mb-[1rem]">
					{aboutQueryResult?.error ? <FilteredError text={aboutQueryResult?.error?.message}/> : null}
					{aboutQueryResult?.loading ? <Loader text={'Fetching Profile'}/> : <>
						<h2 className='dashboard-heading mb-4'>{aboutQueryResult?.data?.about?.title || 'Title not edited'}</h2>
						<Markdown md={aboutQueryResult?.data?.about?.description || noDescription} />
						{canEdit ? <div className={'flex flex-col items-center mt-[3rem] justify-center'}>
							<Button
								onClick={handleEdit}
								disabled={loading}
								htmlType='submit'
								type='primary'
							>
								{loading ? <>Creating</> : 'Update'}
							</Button>
						</div> : null}
					</>}
				</div>}
				{council ? <CouncilVotes address={address} /> : null}
			</Col>
			<Col span={8}>
				<div className='bg-white drop-shadow-md rounded-md ' >
					<div className='flex flex-col p-4 lg:p-6'>
						<div className='dashboard-heading'>Identity </div>
						<SetOnChainIdentityButton />
						<Divider className='mb-0 mt-[2em]' />
					</div>
					<div className='info-box w-full break-words p-1 lg:p-3'>
						<h2>{username}</h2>
						{address ? <>
							<div className=" flex flex-col items-center mb-2">
								<AddressComponent address={address}/>
								<Balance address={address}/>
							</div>
							{identity && <div className='mt-4'>
								{identity?.legal && <Row className='border-b-[1px] border-slate-300'>
									<Col span={8} className='desc py-2 pr-2 border-r-[1px] border-slate-300 text-left text-sidebarBlue font-bold'>Legal:</Col>
									<Col span={16} className='py-2 pl-2 text-left'>{identity.legal}</Col>
								</Row>}
								{identity?.email && <Row className='border-b-[1px] border-slate-300'>
									<Col span={8} className='desc py-2 pr-2 border-r-[1px] border-slate-300 text-left text-sidebarBlue font-bold'>Email:</Col>
									<Col span={16} className='py-2 pl-2 text-left text-pink_primary'><a href={`mailto:${identity.email}`}>{identity.email}</a></Col>
								</Row>}
								{identity?.judgements?.length > 0 && <Row className='border-b-[1px] border-slate-300'>
									<Col span={8} className='desc py-2 pr-2 border-r-[1px] border-slate-300 text-left text-sidebarBlue font-bold'>Judgements:</Col>
									<Col span={16} className='judgments py-2 pl-2 text-left'>{icon} {displayJudgements}</Col>
								</Row>}
								{identity?.pgp && <Row className='border-b-[1px] border-slate-300'>
									<Col span={8} className='desc py-2 pr-2 border-r-[1px] border-slate-300 text-left text-sidebarBlue font-bold'>PGP:</Col>
									<Col span={16} className='py-2 pl-2 text-left'>{identity.pgp}</Col>
								</Row>}
								{identity?.riot && <Row className='border-b-[1px] border-slate-300'>
									<Col span={8} className='desc py-2 pr-2 border-r-[1px] border-slate-300 text-left text-sidebarBlue font-bold'>Riot:</Col>
									<Col span={16} className='py-2 pl-2 text-left'>{identity.riot}</Col>
								</Row>}
								{identity?.twitter && <Row className='border-b-[1px] border-slate-300'>
									<Col span={8} className='desc py-2 pr-2 border-r-[1px] border-slate-300 text-left text-sidebarBlue font-bold'>Twitter:</Col>
									<Col span={16} className='py-2 pl-2 text-left text-pink_primary'><a href={`https://twitter.com/${identity.twitter.substring(1)}`}>{identity.twitter}</a></Col>
								</Row>}
								{identity?.web && <Row className='border-b-[1px] border-slate-300'>
									<Col span={8} className='desc py-2 pr-2 border-r-[1px] border-slate-300 text-left text-sidebarBlue font-bold'>Web:</Col>
									<Col span={16} className='py-2 pl-2 text-left'>{identity.web}</Col>
								</Row>}
								{flags?.isCouncil && <Row>
									<Col span={8} className='desc py-2 pr-2 border-r-[1px] border-slate-300 text-left text-sidebarBlue font-bold'>Roles:</Col>
									<Col span={16} className='py-2 pl-2 text-left'>Council member <CouncilEmoji/></Col>
								</Row>}
							</div>}
						</> : <p>No address attached to this account</p>}
					</div>
				</div>
			</Col>
		</Row>
	);
};

export default Profile;
