// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { EditOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import SidebarRight from 'src/components/SidebarRight';
import { useUserDetailsContext } from 'src/context';
import { useGetUserDetailsLazyQuery } from 'src/generated/graphql';
import Loader from 'src/ui-components/Loader';

import noUserImage from '../../assets/no-user-img.png';
import EditProfile from './EditProfile';

const UserProfile = () => {
	const { id, username } = useUserDetailsContext();
	const [editProfile, setEditProfile] = useState<boolean>(false);

	const [refetch, { data, error }] = useGetUserDetailsLazyQuery({
		variables: {
			user_id: Number(id)
		}
	});

	useEffect(() => {
		refetch();
	}, [refetch]);
	return (
		<section className='w-full bg-white shadow-md p-8 rounded-md flex flex-col'>
			<SidebarRight open={editProfile} closeSidebar={() => setEditProfile(false)}>
				<EditProfile data={data} id={id} refetch={refetch} setEditProfile={setEditProfile} />
			</SidebarRight>
			{
				id ?
					<>
						{
							data && !error ?
								<>
									<article className='flex justify-between'>
										<div className='flex gap-x-6'>
											<div>
												<img className='flex h-w-32 w-32 rounded-full' src={data?.userDetails?.image || noUserImage} alt="user avatar" />
											</div>
											<div className='flex flex-col h-full justify-around'>
												{ username && <h3 className='text-xl font-bold text-sidebarBlue'>{username}</h3>}
												<h3 className='text-grey_primary font-medium text-lg'>
													{data.userDetails?.title? data?.userDetails?.title: 'No Job Title Added'}
												</h3>
												<p className='flex gap-x-2'>
													{ data.userDetails?.badges && JSON.parse(data.userDetails?.badges).length > 0 ?<>
														{JSON.parse(data.userDetails?.badges).map((badge:string, i: number) => (<span className='rounded-3xl bg-pink_primary text-white px-3 py-0.5 font-semibold flex items-center justify-center capitalize' key={i}>{badge}</span>))}
													</> :
														<>
															<span className='rounded-3xl bg-grey_border px-4 h-7 flex opacity-80 items-center justify-center'>
																<span className='rounded-3xl bg-grey_secondary w-10 h-2'>
																</span>
															</span>
															<span className='rounded-3xl bg-grey_border px-4 h-7 flex opacity-80 items-center justify-center'>
																<span className='rounded-3xl bg-grey_secondary w-16 h-2'>
																</span>
															</span>
														</>
													}
												</p>
											</div>
										</div>
										<Button
											size='large'
											className='rounded-md border-grey_secondary flex items-center'
											icon={<EditOutlined />}
											onClick={() => { setEditProfile(!editProfile);} }
										>
											{editProfile ? 'Cancel Edit' : 'Edit Profile'}
										</Button>
									</article>
									<Divider />
									<article>
										{
											data.userDetails?.bio ? <>
												<h2 className='text-xl font-semibold text-sidebarBlue'>About</h2>
												<p className='text-grey_secondary mt-3 text-md font-medium'>{data.userDetails?.bio}</p>
											</>: <p className='text-center text-grey_secondary text-lg font-medium'>Please click on &apos;Edit Profile&apos; to add a bio.</p>
										}
									</article>
								</>
								:
								<Loader />
						}
					</>
					:
					<p className='text-center text-grey_secondary text-md font-medium'>Please login to access profile.</p>
			}
		</section>
	);
};

export default UserProfile;