// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { HomeFilled, TwitterOutlined, YoutubeFilled } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import { Space } from 'antd';
import React from 'react';
import { useNetworkSocialsQuery } from 'src/generated/graphql';
import { CubeIcon, DiscordIcon, GithubIcon, RedditIcon, TelegramIcon } from 'src/ui-components/CustomIcons';
import getNetwork from 'src/util/getNetwork';

const network = getNetwork();
const AboutNetwork = ({ className } : {className?: string}) => {
	// TODO: Enable refetch
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data, error, refetch } = useNetworkSocialsQuery({ variables: {
		network
	} });

	return (
		<div className={`${className} bg-white drop-shadow-md p-6 rounded`}>
			<div className="flex items-center justify-between">
				<h2 className='dashboard-heading'>About</h2>
				{error && <p>{error.message}</p>}
				{!error && data &&
					<Space size={25} className='items-center'>
						{data.blockchain_socials[0].homepage &&
						<a href={data.blockchain_socials[0].homepage} target='_blank' rel='noreferrer'>
							<HomeFilled className='text-lg' />
						</a>
						}
						{data.blockchain_socials[0].twitter &&
						<a href={data.blockchain_socials[0].twitter} target='_blank' rel='noreferrer'>
							<TwitterOutlined className='text-lg' />
						</a>
						}
						{data.blockchain_socials[0].discord &&
						<a href={data.blockchain_socials[0].discord} target='_blank' rel='noreferrer'>
							<DiscordIcon className='text-lg' />
						</a>
						}
						{data.blockchain_socials[0].github &&
						<a href={data.blockchain_socials[0].github} target='_blank' rel='noreferrer'>
							<GithubIcon className='text-lg' />
						</a>
						}
						{data.blockchain_socials[0].youtube &&
						<a href={data.blockchain_socials[0].youtube} target='_blank' rel='noreferrer'>
							<YoutubeFilled className='text-lg' />
						</a>
						}
						{data.blockchain_socials[0].reddit &&
						<a href={data.blockchain_socials[0].reddit} target='_blank' rel='noreferrer'>
							<RedditIcon className='text-lg' />
						</a>
						}
						{data.blockchain_socials[0].telegram &&
						<a href={data.blockchain_socials[0].telegram} target='_blank' rel='noreferrer'>
							<TelegramIcon className='text-lg' />
						</a>
						}
						{data.blockchain_socials[0].block_explorer &&
						<a href={data.blockchain_socials[0].block_explorer} target='_blank' rel='noreferrer'>
							<CubeIcon className='text-white text-lg' />
						</a>
						}
					</Space>
				}
			</div>

			<p className='mt-5'>Join our Community to discuss, contribute and get regular updates from us!</p>
		</div>
	);
};

export default styled(AboutNetwork)`
	.anticon:hover {
		outline: pink_primary 2px solid;
		path {
			fill: pink_primary !important;
		}
	}
`;