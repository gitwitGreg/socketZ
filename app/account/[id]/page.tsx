'use client';
import useGetUser from "@/app/hooks/useGetUser";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from 'react';

const account = () => {
  
  const params  = useParams();

  const {id} = params

  const {user} = useGetUser(id as string);

  const [showPassInput, setShowPassInput] = useState(false);
  const [showUserInput, setShowUserInput] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [wantPassChange, setWantPassChange] = useState(false);
  const [wantNameChange, setWantNameChange] = useState(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [uploadedfile, setUploadedFile] = useState<FileList | null>();
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>('');
  const [submitNewPicture, setSubmitNewPictue] = useState(false);
  const [errorMess, setErrMess] = useState('');
  const [succsessMess, setSuccessMess] = useState('');





  useEffect(() => {
    if(uploadedfile){
      changeProfilePic();
    }
  },[submitNewPicture]);


  const changeProfilePic = async() => {
    if(!uploadedfile){
      setErrMess('error selecting file');
      setTimeout(() => {
        setErrMess('');
      },3000)
      return;
    }
    const form = new FormData();
    if(uploadedfile && user){
      form.append('picture', uploadedfile[0]);
      form.append('userId', user.id);
    }
    try{
      const response = await fetch('/api/profilePicture',{
        method: 'POST',
        body: form
      });
      if(response.ok){
        console.log('profile Picture changed successfully')
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result);
        }
        reader.readAsDataURL(uploadedfile[0]);
        setUploadedFile(null);
        setSubmitNewPictue(false);
      }
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    changePassword();
  },[wantPassChange])

  const changePassword = async() =>{
    if(!newPassword){
      setTimeout(() => {
        setErrMess('');
      },3000)
      return;
    }
    const passObj = {
      userId: user?.id,
      newPass: newPassword
    }
    try{
      const response = await fetch('/api/changePassword', {
        method: 'PUT',
        body: JSON.stringify(passObj)
      });
      if(response.ok){
        console.log('password has changed successfully');
        setNewPassword('')
        setWantPassChange(false);
        setSuccessMess('Password Chnaged');
        setTimeout(() => {
          setSuccessMess('')
        },3000)
      }
    }catch(error){
      console.log(error);
    }
  }


  useEffect(() => {
    if(newUsername === null && wantNameChange){
      setErrMess('Enter a username');
      setTimeout(() => {
        setErrMess('');
      },3000)
      return;
    }
    chnageUsername();
  },[wantNameChange])
  

  const chnageUsername = async() => {
    if(!user || newUsername === ''){
      return;
    }

    console.log(newUsername);

    const userNameObj = {
      userId: user.id,
      newUsername: newUsername
    }

    try{
      const response = await fetch('/api/changeUsername', {
        method: "PUT",
        body: JSON.stringify(userNameObj)
      })

      if(response.ok){
        console.log('useName changed');
        setWantNameChange(false);
        setNewUsername('');
        setSuccessMess('Username Changed successfully');
        console.log
        setTimeout(() => {
          setSuccessMess('');
        },3000)
      }

    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    if(user === undefined){
      return
    }
    const fetchProfPic = async() => {
      try{
        const response = await fetch('/api/getProfilePicture', {
          method: 'POST',
          body: JSON.stringify({fileId: user.picture}),
        })
        if (response.ok) {
          if(response.body === null){
            console.log('no response');
            return;
          }
          const reader = response.body.getReader();
          const chunks = [];

          while (true) {
              const { done, value } = await reader.read();

              if (done) {
                  break;
              }

              chunks.push(value);
          }

          const blob = new Blob(chunks, { type: 'image/png' });
          const file = new File([blob], 'profile-picture.png', { type: 'image/png' });

          const ourReader = new FileReader();
          ourReader.onloadend = () => {
              const dataURL = ourReader.result;
              setImageSrc(dataURL);
          };
          ourReader.readAsDataURL(file);
      }
      }catch(error){
        console.log(error)
      }
    }
    fetchProfPic()
  },[user])


  if(!user){
    return(
      <div className="h-screen w-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <section className="h-auto w-full bg-[#1e2124] flex">
      <div className=" hidden lg:flex lg:flex-col lg:h-auto lg:py-4 lg:w-60 lg:items-center lg:gap-2 px-4 text-white border-[#424549] lg:border-r-4 lg:border-y-0">
        <button className="w-full rounded-lg py-2 hover:bg-[#424549]">
          My Account
        </button>
        <button className="w-full rounded-lg py-2 hover:bg-[#424549]">
          Profile
        </button>
        <Link 
        href='/' 
        className="w-full rounded-lg py-2 hover:bg-[#424549] flex justify-center">
          <button className="">
            Home
          </button>
        </Link>
        <div>
        </div>
      </div>

      <div className="w-full flex py-10 gap-10 flex-col px-4">
        {succsessMess && (
          <div role="alert" className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{succsessMess}</span>
          </div>
        )}
        <div className="card w-[80%] h-[40%] shadow-xl py-4 bg-black text-white">
          <figure className="mt-4">
            {!imageSrc && (
              <div className="h-screen w-full flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}
            {imageSrc && (
              <img 
              className="ml-10 rounded-xl"
              src={imageSrc as string}
              width={200}
              height={200}
              />
            )}
            <button 
            className="bg-purple-500 text-white p-2 rounded ml-20 mt-4"
            onClick={() => setShowUpload(!showUpload)}>
              Change Picture
            </button>
          </figure>
          <div className="card-body item-center justify-center overflow-hidden">
            <h1 className="card-title">
              {user?.name}
            </h1>
            <p>{user?.bio}</p>
            <div className="card-actions justify-end">
            <div className="badge badge-outline">{user?.email}</div>
            <div className="badge badge-outline">{user?.username}</div>
          </div>
        </div>
      </div>
        <div className="text-white flex flex-col">
          {errorMess && (
            <p className="text-red-500">{errorMess}</p>
          )}
          <h1 className ='text-bold text-2xl'>
            Password and Authentication
          </h1>
          <button 
          className="rounded p-2 bg-purple-500 mt-4 mb-4 w-[50%]"
          onClick={() => setShowPassInput(!showPassInput)}>
            Change password
          </button>
          {showPassInput && (
            <div className="flex flex-col gap-3">
              <input 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-black w-[50%]"></input>
              <button 
              className="rounded p-2 bg-purple-500 mt-4 mb-4 w-[50%] text-white"
              onClick={() => setWantPassChange(true)}>
                Submit
              </button>
            </div>
          )}
          <h1 className ='text-bold text-2xl mt-4 mb-2'>
            Username
          </h1>
          <p className="text-xl">current username:  
            <span className="text-lg">{user?.username}</span>
          </p>
          <button 
          className="rounded p-2 bg-purple-500 mt-4 mb-4 w-[50%]"
          onClick={() => setShowUserInput(!showUserInput)}>
            Change Username
          </button>
          {showUserInput && (
            <div className="flex flex-col gap-3">
              <input 
              value={newUsername} 
              onChange={(e) => setNewUsername(e.target.value)}
              className="text-black w-[50%]"></input>
              <button 
              className="rounded p-2 bg-purple-500 mt-4 mb-4 w-[50%] text-white"
              onClick={() => setWantNameChange(true)}>
                Submit
              </button>
            </div>
          )}
          <button 
          className="rounded p-2 bg-purple-500 mt-4 mb-4 w-[50%] text-white"
          onClick={() => setShowUpload(!showUpload)}>
            Change Profile Picture
          </button>
          {showUpload && (
            <div className="gap-3 flex flex-col">
              <input type="file" className="file-input file-input-bordered w-full max-w-xs mt-4" 
              onChange={(e)=> setUploadedFile(e.currentTarget.files)}/>
              <button 
              className="rounded p-2 bg-purple-500 mt-4 mb-4 w-[50%] text-white"
              onClick={() => setSubmitNewPictue(true)}>
                Submit
              </button>
            </div>
          )}
          <Link href={'/'}>
            <Button className="w-[50%] bg-purple-500">
              Home
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default account;
