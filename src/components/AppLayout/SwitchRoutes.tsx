// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Discussions from 'src/screens/Discussions';
import Home from 'src/screens/Home';
import LoginForm from 'src/screens/LoginForm';
import DiscussionPost from 'src/screens/Posts/DiscussionPost';
import PostProposal from 'src/screens/Posts/ProposalPost';
import ReferendumPost from 'src/screens/Posts/ReferendumPost';
import Proposals from 'src/screens/Proposals';
import Referenda from 'src/screens/Referenda';
import RequestResetPassword from 'src/screens/RequestResetPassword';

const SwitchRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path="/request-reset-password" element={<RequestResetPassword/>}/>
			<Route path="/login" element={<LoginForm />}/>

			<Route path='/discussions' element={<Discussions />} />
			<Route path='/post'>
				<Route path=':id' element={<DiscussionPost />} />
			</Route>

			<Route path="/proposals" element={<Proposals />}/>
			<Route path="/proposal/:id" element={<PostProposal />} />

			<Route path="/referenda" element={<Referenda />} />
			<Route path="/referendum/:id" element={<ReferendumPost />} />
		</Routes>
	);
};

export default SwitchRoutes;