// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { WarningOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserDetailsContext } from 'src/context';
import queueNotification from 'src/ui-components/QueueNotification';

import { useVerifyEmailMutation } from '../../generated/graphql';
import { handleTokenChange } from '../../services/auth.service';
import { NotificationStatus } from '../../types';
import FilteredError from '../../ui-components/FilteredError';
import Loader from '../../ui-components/Loader';

const VerifyEmail = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	console.log(token!);

	const currentUser = useUserDetailsContext();
	const [verifyEmailMutation, { error }] = useVerifyEmailMutation({
		variables: {
			token: token!
		}
	});

	useEffect(() => {
		verifyEmailMutation().then(({ data }) => {
			if (data?.verifyEmail?.token) {
				handleTokenChange(data.verifyEmail.token, currentUser);
			}

			if (data?.verifyEmail?.message) {
				queueNotification({
					header: 'Success!',
					message: data.verifyEmail.message,
					status: NotificationStatus.SUCCESS
				});
			}

			navigate('/');
		}).catch((e) => {
			console.error('Email verification error', e);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] /* dependencies are empty as mutation needs to fired only once */);

	return (
		<Row justify='center' align='middle' className='h-full -mt-16'>
			{ error?.message
				? <article className="bg-white shadow-md rounded-md p-8 flex flex-col gap-y-6 md:min-w-[500px]">
					<h2 className='flex flex-col gap-y-2 items-center text-xl font-medium'>
						<WarningOutlined />
						<FilteredError text={error.message}/>
					</h2>
				</article>
				: <Loader/>
			}
		</Row>);
};

export default VerifyEmail;
