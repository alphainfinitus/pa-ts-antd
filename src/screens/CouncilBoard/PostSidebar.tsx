// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SidebarRight from 'src/components/SidebarRight';
import PostDiscussion from 'src/screens/DiscussionPost';
import PostReferendum from 'src/screens/ReferendumPost';

interface Props {
  className?: string
	closeSidebar: () => void
	sidebarState: any
	open: boolean
}

const PostSidebar = ({ className, closeSidebar, open, sidebarState }: Props) => {
	console.log(open);
	return (
		<SidebarRight closeSidebar={closeSidebar} open={open} className={className}>
			<div className="sidebar-content">
				{sidebarState.postType === 'discussion' &&
						<PostDiscussion postID={sidebarState.postID} />
				}
				{sidebarState.postType === 'referenda' &&
						<PostReferendum postID={sidebarState.postID} />
				}
			</div>
		</SidebarRight>
	);
};

export default PostSidebar;
