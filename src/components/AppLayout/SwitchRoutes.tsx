// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from 'src/screens/Home';
import Bounties from 'src/screens/Listing/Bounties';
import Discussions from 'src/screens/Listing/Discussions';
import Proposals from 'src/screens/Listing/Proposals';
import Referenda from 'src/screens/Listing/Referenda';
import Treasury from 'src/screens/Listing/Treasury';
import LoginForm from 'src/screens/LoginForm';
import BountyPost from 'src/screens/Posts/BountyPost';
import DiscussionPost from 'src/screens/Posts/DiscussionPost';
import ProposalPost from 'src/screens/Posts/ProposalPost';
import ReferendumPost from 'src/screens/Posts/ReferendumPost';
import TreasuryPost from 'src/screens/Posts/TreasuryPost';
import RequestResetPassword from 'src/screens/RequestResetPassword';
import SignupForm from 'src/screens/SignupForm';

const SwitchRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path="/request-reset-password" element={<RequestResetPassword/>}/>
			<Route path="/login" element={<LoginForm />}/>
			<Route path="/signup" element={<SignupForm/>} />
			<Route path='/discussions' element={<Discussions />} />
			<Route path='/post'>
				<Route path=':id' element={<DiscussionPost />} />
			</Route>

			<Route path="/proposals" element={<Proposals />}/>
			<Route path="/proposal/:id" element={<ProposalPost />} />

			<Route path="/referenda" element={<Referenda />} />
			<Route path="/referendum/:id" element={<ReferendumPost />} />

			<Route path="/treasury-proposals" element={<Treasury />} />
			<Route path="/treasury/:id" element={<TreasuryPost />} />

			<Route path="/bounties" element={<Bounties />} />
			<Route path="/bounty/:id" element={<BountyPost />} />
		</Routes>
	);
};

export default SwitchRoutes;