// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';

import PP from '../../assets/privacy-policy';
import TAC from '../../assets/terms-and-conditions';
import TOW from '../../assets/terms-of-website';
import Markdown from '../../ui-components/Markdown';

interface Props{
	md: string
}

const MdScreen = ({ md } : Props) => {
	return (
		<section>
			<article className='bg-white p-12 rounded-md shadow-md'>
				<Markdown className='markdown' md={md}/>
			</article>
		</section>
	);
};

const StyledMdScreen = MdScreen;

export const TermsAndConditions = () => <StyledMdScreen md={TAC}/>;
export const PrivacyPolicy = () => <StyledMdScreen md={PP}/>;
export const TermsOfWebsite = () => <StyledMdScreen md={TOW}/>;

