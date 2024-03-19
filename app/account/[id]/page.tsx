'use client';
import useGetUser from "@/app/hooks/useGetUser";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from 'react';
import ppic from '../../../public/ppic.png'
import Image from "next/image";

const account = () => {
  const params  = useParams();

  const {id} = params

  const {user} = useGetUser(id as string);

  const [showPassInput, setShowPassInput] = useState(false);
  const [showUserInput, setShowUserInput] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [uploadedfile, setUploadedFile] = useState<FileList | null>();
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>('');
  const [submitNewPicture, setSubmitNewPictue] = useState(false);


  // if(uploadedfile){
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     console.log(reader.result);
  //     setImageSrc(reader.result)
  //   }
  //   reader.readAsDataURL(uploadedfile[0]);
  // }

  const changeProfilePic = async() => {
    console.log('starting cange profile pic')
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
        const resObj = await response.json();
        console.log(resObj);
      }
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if(uploadedfile){
      changeProfilePic();
    }
  },[uploadedfile])

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
    <section className="h-screen w-full bg-[#1e2124] flex">
      <div className="flex flex-col h-screen py-4 w-60 items-center gap-2 px-4 text-white border-[#424549] border-r-4 border-y-0">
        <button className="w-full rounded-lg py-2 hover:bg-[#424549]">
          My Account
        </button>
        <button className="w-full rounded-lg py-2 hover:bg-[#424549]">
          Profile
        </button>
        <div>
        </div>
      </div>

      <div className="w-full flex py-10 gap-10 flex-col px-4">
        <div className="card w-[80%] h-[40%] shadow-xl py-4 bg-black text-white">
          <figure className="mt-4">
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
          <div className="card-body item-center justify-center">
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
          <h1 className ='text-bold text-2xl'>
            Password and Authentication
          </h1>
          <button 
          className="rounded p-2 bg-purple-500 mt-4 mb-4 w-[50%]"
          onClick={() => setShowPassInput(!showPassInput)}>
            Change password
          </button>
          {showPassInput && (
            <div>
              <input 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-black w-[50%]"></input>
            </div>
          )}
          <h1 className ='text-bold text-2xl mt-4 mb-2'>
            Username
          </h1>
          <p className="text-xl">current username:  
            <span className="text-lg">  {user?.username}</span>
          </p>
          <button 
          className="rounded p-2 bg-purple-500 mt-4 mb-4 w-[50%]"
          onClick={() => setShowUserInput(!showUserInput)}>
            Change Username
          </button>
          {showUserInput && (
            <div>
              <input 
              value={newUsername} 
              onChange={(e) => setNewUsername(e.target.value)}
              className="text-black w-[50%]"></input>
            </div>
          )}
          <button 
          className="rounded p-2 bg-purple-500 mt-4 mb-4 w-[50%] text-white"
          onClick={() => setShowUpload(!showUpload)}>
            Change Profile Picture
          </button>
          {showUpload && (
            <div>
              <input type="file" className="file-input file-input-bordered w-full max-w-xs mt-4" 
              onChange={(e)=> setUploadedFile(e.currentTarget.files)}/>
              {/* <button 
              className="rounded p-2 bg-purple-500 mt-4 mb-4 w-[50%] text-white"
              onClick={() => setSubmitNewPictue(true)}>
                Submit
              </button> */}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default account;
