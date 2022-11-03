// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SearchOutlined } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import React from 'react';
import getNetwork from 'src/util/getNetwork';

const NETWORK = getNetwork();

const SearchBar = () : JSX.Element => {

	return (
		<div className='relative hidden sm:block'>
			<div style={{ left:'10px', position:'absolute', top:'7px', zIndex:100 }}><SearchOutlined/></div>
			<div className="gcse-search" data-as_sitesearch={ ['moonbase', 'moonbeam', 'moonriver', 'kilt'].includes(NETWORK) ? `${NETWORK}.polkassembly.network` : `${NETWORK}.polkassembly.io` }></div>
		</div>
	);
};

export default styled(SearchBar)`
    
`;
