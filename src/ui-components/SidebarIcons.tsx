// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Icon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import React from 'react';
import { ReactComponent as BountiesSVG } from 'src/assets/sidebar/bounties.svg';
import { ReactComponent as CalendarSVG } from 'src/assets/sidebar/calendar.svg';
import { ReactComponent as DemocracyProposalsSVG } from 'src/assets/sidebar/democracy_proposals.svg';
import { ReactComponent as DiscussionsSVG } from 'src/assets/sidebar/discussions.svg';
import { ReactComponent as MembersSVG } from 'src/assets/sidebar/members.svg';
import { ReactComponent as MotionsSVG } from 'src/assets/sidebar/motions.svg';
import { ReactComponent as NewsSVG } from 'src/assets/sidebar/news.svg';
import { ReactComponent as OverviewSVG } from 'src/assets/sidebar/overview.svg';
import { ReactComponent as ReferendaSVG } from 'src/assets/sidebar/referenda.svg';
import { ReactComponent as TipsSVG } from 'src/assets/sidebar/tips.svg';
import { ReactComponent as TreasuryProposalsSVG } from 'src/assets/sidebar/treasury_proposals.svg';

export const OverviewIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={OverviewSVG} {...props} />
);

export const DiscussionsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={DiscussionsSVG} {...props} />
);

export const NewsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={NewsSVG} {...props} />
);

export const TreasuryProposalsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={TreasuryProposalsSVG} {...props} />
);

export const BountiesIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={BountiesSVG} {...props} />
);

export const TipsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={TipsSVG} {...props} />
);

export const DemocracyProposalsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={DemocracyProposalsSVG} {...props} />
);

export const MembersIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={MembersSVG} {...props} />
);

export const MotionsIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={MotionsSVG} {...props} />
);

export const ReferendaIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={ReferendaSVG} {...props} />
);

export const CalendarIcon = (props: Partial<CustomIconComponentProps>) => (
	<Icon component={CalendarSVG} {...props} />
);