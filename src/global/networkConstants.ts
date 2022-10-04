// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import acuityLogo from 'src/assets/parachain-logos/acuity-logo.jpg';
import altairLogo from 'src/assets/parachain-logos/altair-logo.jpeg';
import amplitudeLogo from 'src/assets/parachain-logos/amplitude-logo.png';
import astarLogo from 'src/assets/parachain-logos/astar-logo.png';
import automataLogo from 'src/assets/parachain-logos/automata-logo.jpg';
import basiliskLogo from 'src/assets/parachain-logos/basilisk-logo.jpg';
import pioneerLogo from 'src/assets/parachain-logos/bitcountrypioneer-logo.jpg';
import calamariLogo from 'src/assets/parachain-logos/calamari-logo.png';
import centrifugeLogo from 'src/assets/parachain-logos/centrifuge-logo.png';
import composableFinanceLogo from 'src/assets/parachain-logos/composable-finance-logo.png';
import crustLogo from 'src/assets/parachain-logos/crust-logo.svg';
import gearLogo from 'src/assets/parachain-logos/gear-logo.jpg';
import heikoLogo from 'src/assets/parachain-logos/heiko-logo.png';
import hydradxLogo from 'src/assets/parachain-logos/hydradx-logo.jpg';
import karuraLogo from 'src/assets/parachain-logos/karura-logo.jpg';
import khalaLogo from 'src/assets/parachain-logos/khala-logo.png';
import kiltLogo from 'src/assets/parachain-logos/kilt-logo.png';
import kusamaLogo from 'src/assets/parachain-logos/kusama-logo.gif';
import kylinLogo from 'src/assets/parachain-logos/kylin-logo.png';
import mantaLogo from 'src/assets/parachain-logos/manta-logo.jpg';
import moonbaseLogo from 'src/assets/parachain-logos/moonbase-logo.png';
import moonbeamLogo from 'src/assets/parachain-logos/moonbeam-logo.png';
import moonriverLogo from 'src/assets/parachain-logos/moonriver-logo.png';
import parallelLogo from 'src/assets/parachain-logos/parallel-logo.jpg';
import pendulumLogo from 'src/assets/parachain-logos/pendulum-logo.jpg';
import polkadexLogo from 'src/assets/parachain-logos/polkadex-logo.jpg';
import polkadotLogo from 'src/assets/parachain-logos/polkadot-logo.jpg';
import robonomicsLogo from 'src/assets/parachain-logos/robonomics-logo.jpg';
import shidenLogo from 'src/assets/parachain-logos/shiden-logo.jpg';
import tanganikaLogo from 'src/assets/parachain-logos/tanganika-logo.png';
import turingLogo from 'src/assets/parachain-logos/turing-logo.png';
import westendLogo from 'src/assets/parachain-logos/westend-logo.jpg';

import * as types from '../types';

export const network = {
	POLKADOT: 'polkadot',
	KUSAMA: 'kusama',
	ACUITY: 'acuity',
	ALTAIR: 'altair',
	AMPLITUDE: 'amplitude',
	ASTAR: 'astar',
	AUTOMATA: 'automata',
	BASILISK: 'basilisk',
	CALAMARI: 'calamari',
	CENTRIFUGE: 'centrifuge',
	COMPOSABLE: 'composable',
	CRUST: 'crust',
	CRUSTSHADOW: 'crustshadow',
	GEAR: 'gear',
	HEIKO: 'heiko',
	HYDRADX: 'hydradx',
	KARURA: 'karura',
	KHALA: 'khala',
	KILT: 'kilt',
	KYLIN: 'kylin',
	MANTA: 'manta',
	MOONBASE: 'moonbase',
	MOONBEAM: 'moonbeam',
	MOONRIVER: 'moonriver',
	PARALLEL: 'parallel',
	PENDULUM: 'pendulum',
	PIONEER: 'pioneer',
	POLKADEX: 'polkadex',
	ROBONOMICS: 'robonomics',
	SHIBUYA: 'shibuya',
	SHIDEN: 'shiden',
	TANGANIKA: 'tanganika',
	TINKER: 'tinker',
	TURING: 'turing',
	WESTEND: 'westend'
};

export const tokenSymbol = {
	ACU: 'ACU',
	ASTR: 'ASTR',
	ATA: 'ATA',
	BNC: 'BNC',
	BSX: 'BSX',
	CFG: 'CFG',
	CRU: 'CRU',
	CSM: 'CSM',
	DOL: 'DOL',
	DEV: 'DEV',
	DHX: 'DHX',
	DOT: 'DOT',
	GLMR: 'GLMR',
	HDX: 'HDX',
	HKO: 'HKO',
	KAR: 'KAR',
	KHA: 'KHA',
	KILT: 'KILT',
	KMA: 'KMA',
	KSM: 'KSM',
	KYL: 'KYL',
	LAYR: 'LAYR',
	MOVR: 'MOVR',
	PARA: 'PARA',
	PDEX: 'PDEX',
	PEND: 'PEND',
	SBY: 'SBY',
	SDN: 'SDN',
	TUR: 'TUR',
	WND: 'WND',
	XRT: 'XRT',
	UNIT: 'UNIT'
};

export const chainProperties: types.ChainPropType = {
	[network.POLKADOT]: {
		blockTime: 6000,
		chainId: 0,
		logo: polkadotLogo,
		rpcEndpoint: 'wss://rpc.polkadot.io',
		ss58Format: 0,
		tokenDecimals: 10,
		tokenSymbol: tokenSymbol.DOT
	},
	[network.KUSAMA]: {
		blockTime: 6000,
		chainId: 0,
		logo: kusamaLogo,
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 2,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.KSM
	},
	[network.ACUITY]: {
		blockTime: 6000,
		chainId: 0,
		logo: acuityLogo,
		rpcEndpoint: 'wss://freemont.acuity.social',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.ACU
	},
	[network.ALTAIR]: {
		blockTime: 12000,
		chainId: 0,
		logo: altairLogo,
		rpcEndpoint: 'wss://altair.api.onfinality.io/public-ws',
		ss58Format: 136,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.BNC
	},
	[network.AMPLITUDE]: {
		blockTime: 12000,
		chainId: 0,
		logo: amplitudeLogo,
		rpcEndpoint: 'wss://altair.api.onfinality.io/public-ws',
		ss58Format: 8,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.BNC
	},
	[network.ASTAR]: {
		blockTime: 12000,
		chainId: 592,
		logo: astarLogo,
		rpcEndpoint: 'wss://astar.api.onfinality.io/public-ws',
		ss58Format: 5,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.ASTR
	},
	[network.AUTOMATA]: {
		blockTime: 6000,
		chainId: 0,
		logo: automataLogo,
		rpcEndpoint: 'wss://automata.api.onfinality.io/public-ws',
		ss58Format: 88,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.ATA
	},
	[network.BASILISK]: {
		blockTime: 12000,
		chainId: 2090,
		logo: basiliskLogo,
		rpcEndpoint: 'wss://basilisk.api.onfinality.io/public-ws',
		ss58Format: 10041,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.BSX
	},
	[network.PIONEER]: {
		blockTime: 12000,
		chainId: 0,
		logo: pioneerLogo,
		rpcEndpoint: 'wss://pioneer.api.onfinality.io/public-ws',
		ss58Format: 6,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.BNC
	},
	[network.CALAMARI]: {
		blockTime: 12000,
		chainId: 2084,
		logo: calamariLogo,
		rpcEndpoint: 'wss://calamari.api.onfinality.io/public-ws',
		ss58Format: 78,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.KMA
	},
	[network.CENTRIFUGE]: {
		blockTime: 12000,
		chainId: 0,
		logo: centrifugeLogo,
		rpcEndpoint: 'wss://centrifuge-parachain.api.onfinality.io/public-ws',
		ss58Format: 36,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.CFG
	},
	[network.COMPOSABLE]: {
		blockTime: 12000,
		chainId: 0,
		logo: composableFinanceLogo,
		rpcEndpoint: 'wss://rpc.composable.finance',
		ss58Format: 49,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.LAYR
	},
	[network.CRUST]: {
		blockTime: 12000,
		chainId: 0,
		logo: crustLogo,
		rpcEndpoint: 'wss://rpc.crust.network',
		ss58Format: 66,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.CRU
	},
	[network.CRUSTSHADOW]: {
		blockTime: 12000,
		chainId: 0,
		logo: crustLogo,
		rpcEndpoint: 'wss://rpc-shadow.crust.network',
		ss58Format: 66,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.CSM
	},
	[network.GEAR]: {
		blockTime: 1000,
		chainId: 0,
		logo: gearLogo,
		rpcEndpoint: 'wss://rpc-node.gear-tech.io:443',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.UNIT
	},
	[network.HEIKO]: {
		blockTime: 13000,
		chainId: 0,
		logo: heikoLogo,
		rpcEndpoint: 'wss://heiko-rpc.parallel.fi',
		ss58Format: 63,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.HKO
	},
	[network.HYDRADX]: {
		blockTime: 12000,
		chainId: 0,
		logo: hydradxLogo,
		rpcEndpoint: 'wss://hydradx-rpc.dwellir.com',
		ss58Format: 63,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.HDX
	},
	[network.KARURA]: {
		blockTime: 12000,
		chainId: 0,
		logo: karuraLogo,
		rpcEndpoint: 'wss://karura.api.onfinality.io/public-ws',
		ss58Format: 8,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.KAR
	},
	[network.KYLIN]: {
		blockTime: 12000,
		chainId: 0,
		logo: kylinLogo,
		rpcEndpoint: 'wss://polkadot.kylin-node.co.uk',
		ss58Format: 42,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.KYL
	},
	[network.KHALA]: {
		blockTime: 12000,
		chainId: 0,
		logo: khalaLogo,
		rpcEndpoint: 'wss://khala.api.onfinality.io/public-ws',
		ss58Format: 30,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.KHA
	},
	[network.KILT]: {
		blockTime: 12000,
		chainId: 0,
		logo: kiltLogo,
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 38,
		tokenDecimals: 15,
		tokenSymbol: tokenSymbol.KILT
	},
	[network.MANTA]: {
		blockTime: 12000,
		chainId: 1287,
		logo: mantaLogo,
		rpcEndpoint: 'wss://ws.rococo.dolphin.engineering',
		ss58Format: 78,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.DOL
	},
	[network.MOONBASE]: {
		blockTime: 12000,
		chainId: 1287,
		logo: moonbaseLogo,
		rpcEndpoint: 'wss://moonbeam-alpha.api.onfinality.io/public-ws',
		ss58Format: 0,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.DEV
	},
	[network.MOONBEAM]: {
		blockTime: 12000,
		chainId: 1284,
		logo: moonbeamLogo,
		rpcEndpoint: 'wss://moonbeam.api.onfinality.io/public-ws',
		ss58Format: 1284,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.GLMR
	},
	[network.MOONRIVER]: {
		blockTime: 12000,
		chainId: 1285,
		logo: moonriverLogo,
		rpcEndpoint: 'wss://moonriver.api.onfinality.io/public-ws',
		ss58Format: 1285,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.MOVR
	},
	[network.PARALLEL]: {
		blockTime: 12000,
		chainId: 172,
		logo: parallelLogo,
		rpcEndpoint: 'wss://rpc.parallel.fi',
		ss58Format: 172,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.PARA
	},
	[network.PENDULUM]: {
		blockTime: 6000,
		chainId: 0,
		logo: pendulumLogo,
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 88,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.PEND
	},
	[network.POLKADEX]: {
		blockTime: 12000,
		chainId: 0,
		logo: polkadexLogo,
		rpcEndpoint: 'wss://polkadex.api.onfinality.io/public-ws',
		ss58Format: 88,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.PDEX
	},
	[network.ROBONOMICS]: {
		blockTime: 12000,
		chainId: 2048,
		logo: robonomicsLogo,
		rpcEndpoint: 'wss://robonomics.api.onfinality.io/public-ws',
		ss58Format: 32,
		tokenDecimals: 9,
		tokenSymbol: tokenSymbol.XRT
	},
	[network.SHIBUYA]: {
		blockTime: 12000,
		chainId: 81,
		logo: shidenLogo,
		rpcEndpoint: 'wss://shibuya-rpc.dwellir.com',
		ss58Format: 5,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.SBY
	},
	[network.SHIDEN]: {
		blockTime: 12000,
		chainId: 336,
		logo: shidenLogo,
		rpcEndpoint: 'wss://shiden.api.onfinality.io/public-ws',
		ss58Format: 5,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.SDN
	},
	[network.TANGANIKA]: {
		blockTime: 12000,
		chainId: 336,
		logo: tanganikaLogo,
		rpcEndpoint: 'wss://tanganika.datahighway.com',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.DHX
	},
	[network.TURING]: {
		blockTime: 12000,
		chainId: 2114,
		logo: turingLogo,
		rpcEndpoint: 'wss://turing-rpc.dwellir.com',
		ss58Format: 51,
		tokenDecimals: 10,
		tokenSymbol: tokenSymbol.TUR
	},
	[network.WESTEND]: {
		blockTime: 6000,
		chainId: 0,
		logo: westendLogo,
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 0,
		tokenDecimals: 10,
		tokenSymbol: tokenSymbol.WND
	}
};

export const chainLinks: types.ChainLinksType = {
	[network.POLKADOT]: {
		blockExplorer: 'https://polkadot.subscan.io/',
		discord: 'https://discord.gg/wGUDt2p',
		github: 'https://github.com/paritytech/polkadot',
		homepage: 'https://polkadot.network/',
		reddit: 'https://www.reddit.com/r/polkadot',
		telegram: 'https://t.me/PolkadotOfficial',
		twitter: 'https://twitter.com/Polkadot',
		youtube: 'https://www.youtube.com/channel/UCB7PbjuZLEba_znc7mEGNgw'
	},
	[network.KUSAMA]: {
		blockExplorer: 'https://kusama.subscan.io/',
		discord: 'https://discord.gg/9AWjTf8wSk',
		github: 'https://github.com/paritytech/polkadot',
		homepage: 'https://kusama.network/',
		reddit: 'https://www.reddit.com/r/Kusama/',
		telegram: 'https://t.me/kusamanetworkofficial',
		twitter: 'https://twitter.com/kusamanetwork',
		youtube: 'https://www.youtube.com/channel/UCq4MRrQhdoIR0b44GxcCPxw'
	}
};

export const chainDetails: { [index: string]: string} = {
	[network.POLKADOT]: 'Polkadot enables scalability by allowing specialized blockchains to communicate with each other in a secure, trust-free environment. Polkadot is built to connect and secure unique blockchains, whether they be public, permission-less networks, private consortium chains, or oracles and other Web3 technologies. It enables an internet where independent blockchains can exchange information under common security guarantees. Polkadot uses a sophisticated governance mechanism that allows it to evolve gracefully overtime at the ultimate behest of its assembled stakeholders. The stated goal is to ensure that the majority of the stake can always command the network.',
	[network.KUSAMA]: 'Kusama is an early release of Polkadot: a scalable, multichain network for radical innovation. Kusama serves as a proving ground that allows teams and developers to build and deploy a parachain, and experiment with Polkadot’s governance and NPoS functionality in a real environment.'
};

export const addressPrefix: Record<string, number> = {
	'kusama': 2,
	'moonbeam': 1284,
	'moonriver': 1285,
	'polkadot': 0
};