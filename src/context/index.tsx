// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useContext } from 'react';

import { ApiContext } from './ApiContext';
import { MetaContext } from './MetaContext';
import { ModalContext } from './ModalContext';
import { UserDetailsContext } from './UserDetailsContext';

const useModalContext = () => {
	return useContext(ModalContext);
};

const useUserDetailsContext = () => {
	return useContext(UserDetailsContext);
};

const useApiContext = () => {
	return useContext(ApiContext);
};

const useMetaContext = () => {
	return useContext(MetaContext);
};

export { useModalContext, useUserDetailsContext, useApiContext, useMetaContext };