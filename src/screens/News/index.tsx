// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { FC } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
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
					{isPolkadotOrKusama && <h4>{profile === Profile.Kusama? 'Kusama': 'Polkadot'}</h4>}
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
					<h4>{profile2 === Profile.Kusama ? 'Kusama' : 'Polkadot'}</h4>
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