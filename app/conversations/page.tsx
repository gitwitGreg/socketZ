'use client'

import React, { useState } from 'react'

type Conversations = {
  content: string
  createdAt: any
  id: string
  recipient: string | null
  roomId?: string | null
}

const Conversations = ({conversations, onSelectConversation, user, socket }: {conversations: Conversations[], onSelectConversation : any, user: UserAccount, socket: any}) => {

  const [newMessUser, setNewMessUser] = useState<string>('');
  const [responseMess, setResponseMess] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');


  const makeNewMessage = async(e: any)=> {
    try{

      if(!newMessUser){
        setResponseMess('Please enter a valid username');
        return;
      }

      const newMessageObj = {
        recipient: newMessUser,
        message: messageContent,
        senderId: user.id,
      }

      const response = await fetch('/api/sendNewMessage',{
        method: 'POST',
        body: JSON.stringify(newMessageObj)
      });

      if(response.ok){
        socket.emit('initialMess', user.id);
        setResponseMess('Message sent succesfully');
        console.log('made it to socket');
      }

      if(response.status === 404){
        socket.emit('initialMessErr', user.id);
        console.log('error made it to scoket');
      }

    }catch(error){
      console.log(error);
    }
  }


  if(!conversations.length){
    return(
      <div className="drawer lg:drawer-open h-auto w-auto">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label> 
      </div> 
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-80 min-h-full bg-[#424549] text-whit gap-1">
          <li className='hover:bg-[#424549] text-white'>
            <h1>No messages</h1>
          </li>
        </ul>
      </div>  
   </div>
  )
  }

  return (
    <div className='h-auto w-auto'>
      <div className='ml-4 gap-2 flex flex-col'>
        <input className='h-auto bg-[#424549]' 
        onChange={(e) => setNewMessUser(e.target.value)}
        placeholder='Enter a username'/>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn bg-[#424549] text-white" 
        onClick={()=>document.getElementById('my_modal_1').showModal()}>New Message</button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box bg-[#1e2124] gap-4 flex flex-col">
            <h3 className="font-bold text-lg">Enter a message for the user</h3>
            <input  className='h-[50px] w-auto rounded text-black' 
            placeholder='Say Hi!'
            onChange={(e) => setMessageContent(e.target.value)}/>
            <div className="modal-action">
              <form method="dialog">
                <button 
                className="btn"
                onClick={makeNewMessage}>
                  Send
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
      <div className="drawer lg:drawer-open h-screen relative">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
            Open drawer
          </label>
        </div> 
        <div className="drawer-side bg-[#424549] h-auto w-auto absolute mt-[50px] overflow-y-auto">
          <div className="conversation-list">
            {conversations.map((conversation, index) => (
              <div key={index} className="conversation-item">
                <ul className="menu p-4 w-80 min-h-full bg-[#1e2124] text-white gap-1">
                  <li 
                    className='hover:bg-[#424549] text-white'
                    onClick={() => onSelectConversation(conversation.id)}>
                    <h1>{conversation.recipient}</h1>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
  
}

export default Conversations
