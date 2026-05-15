import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'

const Profile = () => {

  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: ""
    }
  });

  const [isEdit, setIsEdit] = useState(false);

  const fetchUserProfileData = async () => {
    try {
      const response = await fetch(backendUrl + '/api/user/profile', {
        headers: { token }
      });
      const data = await response.json();
      if (data.success) {
        setUserData({
          name: data.userData.name,
          email: data.userData.email,
          phone: data.userData.phone || "",
          address: data.userData.address || { line1: "", line2: "" }
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  const updateUserProfileData = async () => {
    try {
      const response = await fetch(backendUrl + '/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          address: userData.address
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Profile updated successfully!");
        setIsEdit(false);
        fetchUserProfileData();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUserProfileData();
    }
  }, [token, navigate])

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className='max-w-2xl flex flex-col gap-2 text-sm pt-10 border-t m-auto'>

      <div className='text-2xl mb-3 text-center sm:text-left'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className='bg-white shadow-lg rounded-xl p-8 border mt-4'>
        <div className='flex items-center gap-6 mb-8'>
          <img className='w-24 sm:w-36 rounded-full border-4 border-gray-100 shadow-sm' src={assets.profile_icon} alt="Profile" />
          <div className='flex-1'>
            {
              isEdit 
              ? <input className='bg-gray-50 border border-gray-200 rounded px-3 py-2 text-2xl font-medium w-full max-w-80 outline-none focus:border-gray-400 transition-colors' type="text" value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
              : <p className='font-medium text-3xl text-neutral-800'>{userData.name}</p>
            }
          </div>
        </div>

        <hr className='bg-zinc-200 h-[1px] border-none my-6' />

        <div>
          <p className='text-neutral-500 uppercase tracking-wider text-xs font-semibold mb-4'>Contact Information</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-4 items-center text-neutral-700'>
            <p className='font-medium'>Email id:</p>
            <p className='text-blue-500 bg-blue-50 px-3 py-1 rounded w-fit'>{userData.email}</p>
            
            <p className='font-medium'>Phone:</p>
            {
              isEdit 
              ? <input className='bg-gray-50 border border-gray-200 rounded px-3 py-1.5 w-full max-w-64 outline-none focus:border-gray-400 transition-colors' type="text" value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} placeholder="Enter your phone number" />
              : <p className='text-blue-400'>{userData.phone || "Not provided"}</p>
            }
            
            <p className='font-medium self-start mt-1.5'>Address:</p>
            {
              isEdit
              ? <div className='flex flex-col gap-2 w-full max-w-80'>
                  <input className='bg-gray-50 border border-gray-200 rounded px-3 py-1.5 outline-none focus:border-gray-400 transition-colors' onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line1: e.target.value}}))} value={userData.address.line1} type="text" placeholder="Line 1" />
                  <input className='bg-gray-50 border border-gray-200 rounded px-3 py-1.5 outline-none focus:border-gray-400 transition-colors' onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line2: e.target.value}}))} value={userData.address.line2} type="text" placeholder="Line 2" />
                </div>
              : <div className='text-gray-500 bg-gray-50 p-3 rounded'>
                  {userData.address?.line1 || "No address provided."}
                  {userData.address?.line2 && <br />}
                  {userData.address?.line2}
                </div>
            }
          </div>
        </div>

        <div className='mt-10 flex gap-4 pt-4 border-t border-gray-100'>
          {
            isEdit 
            ? <button className='bg-black text-white px-8 py-2.5 rounded-md hover:bg-gray-800 transition-all font-medium' onClick={updateUserProfileData}>Save information</button>
            : <button className='border border-gray-300 text-gray-700 px-8 py-2.5 rounded-md hover:bg-gray-50 transition-all font-medium' onClick={() => setIsEdit(true)}>Edit Profile</button>
          }
          <button onClick={logout} className='border border-red-200 text-red-500 px-8 py-2.5 rounded-md hover:bg-red-50 transition-all font-medium ml-auto'>Logout</button>
        </div>
      </div>

    </div>
  )
}

export default Profile
