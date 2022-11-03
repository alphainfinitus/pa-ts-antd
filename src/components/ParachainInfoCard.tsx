// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import { Divider } from 'antd';
import React from 'react';
import kusamaLogo from 'src/assets/kusama-logo.gif';
import auctionIcon from 'src/assets/parachains/auction.png';
import chainIcon from 'src/assets/parachains/chain-link.png';
import crowdloansIcon from 'src/assets/parachains/crowdloan.png';
import projectsIcon from 'src/assets/parachains/projects.png';
import polkadotLogo from 'src/assets/polkadot-logo-small-inverted.png';

interface Props {
	className?: string
	network: 'polkadot' | 'kusama'
}

const ParachainInfoCard = ({ className, network }: Props) => {
	const polkadotMetrics = {
		auction: '14th',
		crowdloans: '5',
		parachains: '14',
		projects: '23'
	};

	const kusamaMetrics = {
		auction: '31st',
		crowdloans: '5',
		parachains: '29',
		projects: '23'
	};

	const metrics = network=='polkadot' ? polkadotMetrics : kusamaMetrics;

	return (
		<div className={className}>
			<div className="bg-white drop-shadow-md p-3 lg:p-6 rounded-md">
				<div className='parachain-card-header'>
					<img src={network=='polkadot' ? polkadotLogo : kusamaLogo} alt="Chain Logo" />
					<span className='network-name text-sidebarBlue'>{network}</span>
				</div>
				<div className='parachain-card-meta text-sidebarBlue opacity-90'>
					{network == 'polkadot' ? '11%' : '31%' } of Total Supply Locked<span className='hidden-sm'> in Parachains and Crowdloans</span>
				</div>

				<div className="mt-3 text-sidebarBlue font-medium">
					<span> <span className='text-navBlue'></span>
					</span>
				</div>
				<Divider className='my-3' />
				<div className='parachain-card-desc'>
					{/* Auction */}
					<div className='metric-container'>
						<div className='metric-line'>
							<img src={auctionIcon} alt="Auction Icon" />
							<span className='metric-num text-sidebarBlue'>{metrics.auction}</span>
						</div>
						<div className='metric-name text-navBlue'>Auction</div>
					</div>

					{/* Crowdloans */}
					<div className='metric-container'>
						<div className='metric-line'>
							<img src={crowdloansIcon} alt="Crowdloans Icon" />
							<span className='metric-num text-sidebarBlue'>{metrics.crowdloans}</span>
						</div>
						<div className='metric-name text-navBlue'>Crowdloans</div>
					</div>

					{/* Parachains */}
					<div className='metric-container'>
						<div className='metric-line'>
							<img src={chainIcon} alt="Parachains Icon" />
							<span className='metric-num text-sidebarBlue'>{metrics.projects}</span>
						</div>
						<div className='metric-name text-navBlue'>Parachains</div>
					</div>

					{/* Projects */}
					<div className='metric-container'>
						<div className='metric-line'>
							<img src={projectsIcon} alt="Parachains Icon" />
							<span className='metric-num text-sidebarBlue'>{metrics.projects}</span>
						</div>
						<div className='metric-name text-navBlue'>Projects</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default styled(ParachainInfoCard)`
		.parachain-card-header {
			display: flex !important;
			align-items: center;
			font-size: 18px !important;

			@media only screen and (max-width: 768px) {
				font-size: 16px !important;
				font-weight: 500;
			}
			
			img {
				margin-right: 20px;
				margin-top: 2px;
				height: 33px;
				width: 33px;

				@media only screen and (max-width: 768px) {
					height: 24px;
					width: 24px;
				}
			}

			.network-name {
				text-transform: capitalize;
				font-weight: 500;
			}

			.dotDivider {
				height: 5px;
				width: 5px;
				background-color: #4E4E4E;
				margin: 0 20px;
				border-radius: 50%;
				display: inline-block;
			}
		}

		.parachain-card-meta {
			margin-left: 53px;
			margin-top: 12px;
			margin-bottom: 24px;
			font-size: 14px !important;

			@media only screen and (max-width: 768px) {
				font-size: 12px !important;
				margin-top: 0;
				margin-bottom: 16px;
				margin-left: 43px;

				.hidden-sm {
					display: none;
				}
			}
		}

		.parachain-card-desc{
			display: flex !important;
			align-items: center;
			justify-content: space-around;
			margin-left: 20px;
			margin-top: 24px;

			@media only screen and (max-width: 768px) {
				margin-left: 0;
				margin-top: 16px;
			}

			.metric-line {
				display: flex;
				align-items: center;

				img {
					@media only screen and (max-width: 768px) {
						height: 14px;
						width: auto;
					}
				}

				.metric-num {
					margin-left: 7px;
					font-weight: 500;
					font-size: 14px;

					@media only screen and (max-width: 768px) {
						font-size: 12px;
					}
				}
			}

			.metric-name {
				margin-top: 8px !important;
				font-size: 14px;

				@media only screen and (max-width: 768px) {
					font-size: 12px;
				}
			}
		}
`;
