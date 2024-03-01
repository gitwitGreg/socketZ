'use client'
import React, { useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { UserAccount } from '../messages/MessageComp'
import Link from 'next/link'


type prevMessObj = {
  content: string
  createdAt: string
  id: string
  recipient: string
  roomId: string | null
  sender: UserAccount
  senderId: string
}

type prevGroupMessObj = {
  messages: prevMessObj[],
  users: User[]
}


const PreviousMessages = ({conversationId, user, socket}: {conversationId: string | null, user: UserAccount, socket: any}) => {
  
  const [messages, setMessages] = useState<prevMessObj[] | undefined>();
  const [chatRoomMessages, setchatRoomMessages] = useState<prevGroupMessObj | undefined>();
  
  useEffect(() => {
    const getMessages = async() => {
      console.log(conversationId)
      try{
        if(!conversationId){
          return
        }
        const response = await fetch('api/getMessages', {
          method: 'POST',
          body: JSON.stringify(conversationId)
        })
        if(response.ok){
          const retrivedMessages = await response.json()
          if(retrivedMessages.users){
            setchatRoomMessages(retrivedMessages);
            setMessages(undefined)
          }
          else{
            setMessages(retrivedMessages);
            setchatRoomMessages(undefined)
          }
        }
      }catch(error){
        console.log(error);
      }
    }
    getMessages();
    const handleNewMessage = () => {
      getMessages();
    }
    socket.on('replyEvent', handleNewMessage);
  },[conversationId])


  if(!messages && !chatRoomMessages || !user){
    return(
      <div className="h-screen w-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  console.log('chat message before return', chatRoomMessages?.messages);

  if(chatRoomMessages?.messages && !messages){
    return(
      <div>
        <div className='items-center - justify-center flex py-2'>
          {chatRoomMessages.users.map((user, index) => (
            <Link 
            href='/account'
            key={index}>
              {user.username}
            </Link>
          ))}
        </div>

        <div className=' ml-4 h-auto w-auto mr-8 mt-4'>
          {chatRoomMessages.messages.map((message, index) => (
            <div
            className={message?.senderId === user.id? 'chat chat-end' : 'chat chat-start'}
            key={index}>
              <div className="w-10 rounded-full">
                <img 
                alt="Tailwind CSS chat bubble component" 
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
              <div className="chat-header">
                {message.sender.username}
                <time className="text-xs opacity-50">12:45</time>
              </div>
              <div className="chat-bubble overflow-hidden">
                {message.content}
              </div>
              <div className="chat-footer opacity-50">
                Delivered
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='ml-4 h-auto w-auto mr-8 mt-4'>
      {messages?.map((message, index) => (
        <div 
        className={message?.senderId === user.id? 'chat chat-end' : 'chat chat-start'}
        key={index}>
          <div>
          <div className="w-10 rounded-full">
            <img 
            alt="Tailwind CSS chat bubble component" 
            src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
        <div className="chat-header">
          {message.sender.username}
          <time className="text-xs opacity-50">12:45</time>
        </div>
        <div className="chat-bubble overflow-hidden">{message.content}</div>
        <div className="chat-footer opacity-50">
          Delivered
        </div>
        </div>
      ))}
    </div>
  )
}

export default PreviousMessages
