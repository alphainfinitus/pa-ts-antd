// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { WarningOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserDetailsContext } from 'src/context';
import queueNotification from 'src/ui-components/QueueNotification';

import { useUndoEmailChangeMutation } from '../../generated/graphql';
import { handleTokenChange } from '../../services/auth.service';
import { NotificationStatus } from '../../types';
import FilteredError from '../../ui-components/FilteredError';
import Loader from '../../ui-components/Loader';

const UndoEmailChange = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const currentUser = useUserDetailsContext();
	const [undoEmailChangeMutation, { error }] = useUndoEmailChangeMutation({
		variables: {
			token: token!
		}
	});

	useEffect(() => {
		undoEmailChangeMutation().then(({ data }) => {
			if (data?.undoEmailChange?.token) {
				handleTokenChange(data.undoEmailChange.token, currentUser);
			}

			if (data?.undoEmailChange?.message) {
				queueNotification({
					header: 'Success!',
					message: data.undoEmailChange.message,
					status: NotificationStatus.SUCCESS
				});
			}

			navigate('/');
		}).catch((e) => {
			console.error('Undo email Change error', e);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[currentUser, undoEmailChangeMutation]);

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
		</Row>
	);
};

export default UndoEmailChange;