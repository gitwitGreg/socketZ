'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Search from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person';
import Pin from '@mui/icons-material/pin';
import { useSession } from 'next-auth/react';
import { setTimeout } from 'timers';



const NavBar = () => {
  const [ user, setUser ] = useState<UserAccount>()
  const [ room, setRoom ] = useState('');
  const [newRoom, setNewRoom] = useState('')
  const [ showAlert, setShowAlert ] = useState(false);
  const session = useSession();

  const getUser = async() => {
    if(session.status === 'authenticated'){
      try{
        const response = await fetch('api/user', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(session.data.user?.email)
        })
        if(response.ok){
          const userInfo = await response.json();
          setUser(userInfo);
          setTimeout(() => {
            setShowAlert(false);
          },5000)
        }
      }catch(error){
        console.log(error);
      }
    }
  }
  useEffect(() => {
    getUser();
  },[session])


  const joinRoom = async() => {
    console.log('starting join rooom function')
    if(user){
      const roomRequestInfo = {
        room: room,
        user: user,
        create: false
      }
      const response = await fetch('api/chatRooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify(roomRequestInfo)
      })
      if(response.ok){
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          },3000)
          setRoom('');
      }else{
        console.log('error joining room');
      }
    }
  }

  const createRoom = async () => {
    const newRoomObj = {
      roomName : newRoom,
      userId: user?.id,
      create: true
    }
    const response = await fetch('api/chatRooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRoomObj)
    })
    if(response.ok){
      setNewRoom('');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      },3000)
    }else{
      console.log('error creating ChatRoom');
    }
  }

   const handleKeyDown = (e:any) => {
    if(e.key === 'Enter'){
      if(room !== ''){
        joinRoom();
      }
      else if(newRoom !== ''){
        createRoom()
      }
    }
   }


  return (

    <div className='flex justify-between shadow px-4 py-4 bg-[#1e2124] w-full h-full'>
      <div className='flex items-center justify-cente w-[30%]'>
          <input 
          className='rounded w-[60%] h-[100%] text-sm px-4 bg-[#424549] border-[#1e2124] border py-2'
          placeholder='Join a Chatroom'
          onChange={(e) => setRoom(e.target.value)}
          value={room}
          onKeyDown={handleKeyDown}>
        </input>
      </div>
      {showAlert && (
        <div role="alert" className="alert alert-success w-[60%] mr-40">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Your purchase has been confirmed!</span>
      </div>
      )}

      <div className='flex gap-10 items-center justify-center text-white'>
            <Link href='/search'>
                <Search/>
            </Link>
            <Link href='/saved'>
                <Pin />
            </Link>
            <Link href={`/account/${user?.id}`}>
                <PersonIcon />
            </Link>
            <div className='flex justify-between w-full h-full'>
              <input 
              className='rounded w-[100%] h-[100%] text-sm px-4 bg-[#424549] border border-[#1e2124] text-black'
              placeholder='createRoom'
              onChange={(e) => setNewRoom(e.target.value)}
              value={newRoom}
              onKeyDown={handleKeyDown}>   
              </input>
            </div>
        </div>
    </div>

  )
  
}

export default NavBar