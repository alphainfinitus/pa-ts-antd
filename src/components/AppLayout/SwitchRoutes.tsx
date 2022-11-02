// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreatePost from 'src/screens/CreatePost';
import Home from 'src/screens/Home';
import Bounties from 'src/screens/Listing/Bounties';
import ChildBounties from 'src/screens/Listing/ChildBounties';
import Discussions from 'src/screens/Listing/Discussions';
import Motions from 'src/screens/Listing/Motions';
import Parachains from 'src/screens/Listing/Parachains';
import Proposals from 'src/screens/Listing/Proposals';
import Referenda from 'src/screens/Listing/Referenda';
import TechCommProposals from 'src/screens/Listing/TechCommProposals';
import Tips from 'src/screens/Listing/Tips';
import Treasury from 'src/screens/Listing/Treasury';
import LoginForm from 'src/screens/LoginForm';
import News from 'src/screens/News';
import NotFound from 'src/screens/NotFound';
import NotificationSettings from 'src/screens/NotificationSettings';
import BountyPost from 'src/screens/Posts/BountyPost';
import ChildBountyPost from 'src/screens/Posts/ChildBountyPost';
import DiscussionPost from 'src/screens/Posts/DiscussionPost';
import MotionPost from 'src/screens/Posts/MotionPost';
import ProposalPost from 'src/screens/Posts/ProposalPost';
import ReferendumPost from 'src/screens/Posts/ReferendumPost';
import TechCommProposalPost from 'src/screens/Posts/TechCommProposalPost';
import TipPost from 'src/screens/Posts/TipPost';
import TreasuryPost from 'src/screens/Posts/TreasuryPost';
import RequestResetPassword from 'src/screens/RequestResetPassword';
import Settings from 'src/screens/Settings';
import SignupForm from 'src/screens/SignupForm';
import UserProfile from 'src/screens/UserProfile';

const SwitchRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path="/request-reset-password" element={<RequestResetPassword/>}/>
			<Route path="/login" element={<LoginForm />}/>
			<Route path="/signup" element={<SignupForm/>} />
			<Route path="/settings" element={<Settings/>} />
			<Route path="/notification-settings" element={<NotificationSettings/>} />
			<Route path="/user/:username" element={<UserProfile/>} />
			<Route path='/discussions' element={<Discussions />} />
			<Route path='/news' element={<News />} />
			<Route path='/post'>
				<Route path=':id' element={<DiscussionPost />} />
				<Route path="create" element={<CreatePost />} />
			</Route>

			<Route path='parachains' element={<Parachains/>} />

			<Route path="/proposals" element={<Proposals />}/>
			<Route path="/proposal/:id" element={<ProposalPost />} />

			<Route path="/referenda" element={<Referenda />} />
			<Route path="/referendum/:id" element={<ReferendumPost />} />

			<Route path="/treasury-proposals" element={<Treasury />} />
			<Route path="/treasury/:id" element={<TreasuryPost />} />

			<Route path="/bounties" element={<Bounties />} />
			<Route path="/bounty/:id" element={<BountyPost />} />

			<Route path="/child_bounties" element={<ChildBounties />} />
			<Route path="/child_bounty/:id" element={<ChildBountyPost />} />

			<Route path="/tips" element={<Tips />} />
			<Route path="/tip/:hash" element={<TipPost />} />

			<Route path="/motions" element={<Motions />} />
			<Route path="/motion/:id" element={<MotionPost />} />

			<Route path="/tech-comm-proposals" element={<TechCommProposals />} />
			<Route path="/tech/:id" element={<TechCommProposalPost />} />

			<Route path="*" element={<NotFound />} />

		</Routes>
	);
};

export default SwitchRoutes;