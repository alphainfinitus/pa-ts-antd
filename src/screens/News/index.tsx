// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import kusamaLogo from 'src/assets/kusama-logo.gif';
import polkadotLogo from 'src/assets/parachain-logos/polkadot-logo.jpg';
import { chainLinks } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

const network = getNetwork();

enum Profile {
	Polkadot='polkadot',
	Kusama='kusamanetwork'
}

const News: FC = () => {
	const profile = chainLinks[network].twitter.split('/')[3];
	const isPolkadotOrKusama = profile === Profile.Kusama || profile === Profile.Polkadot;
	const profile2 = profile === Profile.Kusama? Profile.Polkadot: Profile.Kusama;

	const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

	return (
		<div className='w-full h-full'>
			<h3 className='font-medium text-lg tracking-wide leading-7 text-sidebarBlue'>
                News
			</h3>
			<section className='mt-6 w-full flex flex-col md:flex-row gap-5'>
				<article className='flex-1'>
					{isPolkadotOrKusama && <div className='flex items-center mb-2'>
						<img src={profile === Profile.Kusama? kusamaLogo : polkadotLogo} className='rounded-full' height={34} width={34} alt={`${profile === Profile.Kusama? 'Kusama': 'Polkadot'} Logo`} />
						<h4 className='text-[18px] font-medium text-sidebarBlue ml-2'>{profile === Profile.Kusama? 'Kusama': 'Polkadot'}</h4>
					</div>}
					<TwitterTimelineEmbed
						sourceType="profile"
						screenName={profile}
						autoHeight={false}
						noHeader={true}
						options={
							{ height: vh - 250 }
						}
					/>
				</article>
				{isPolkadotOrKusama && (<article className='flex-1'>
					{isPolkadotOrKusama && <div className='flex items-center mb-2'>
						<img src={profile2 === Profile.Kusama? kusamaLogo : polkadotLogo} className='rounded-full' height={34} width={34} alt={`${profile2 === Profile.Kusama? 'Kusama': 'Polkadot'} Logo`} />
						<h4 className='text-[18px] font-medium text-sidebarBlue ml-2'>{profile2 === Profile.Kusama? 'Kusama': 'Polkadot'}</h4>
					</div>}
					<TwitterTimelineEmbed
						sourceType="profile"
						screenName={profile2}
						autoHeight={false}
						noHeader={true}
						options={
							{ height: vh - 250 }
						}
					/>
				</article>)}
			</section>
		</div>
	);

};

export default News;