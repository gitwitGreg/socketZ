'use client'
import React, { useState, useEffect } from 'react'
import { UserAccount } from '../ constants';
import { Message } from '@prisma/client';
import { Receipt } from 'lucide-react';
import { prevGroupMessObj } from '../ constants';
import { prevMessObj } from '../ constants';

const NewMessage = ( {socket, user, selectedConversation}: {socket: any, user: UserAccount| undefined, selectedConversation: string | null}) => {
  const [ message, setMessage ] = useState<string>('');
  const [ isTypeMessage, setIsTypeMessage ] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<string | null>('')
  const [chatRoom, setChatRoom] = useState<string | null>('');


  useEffect(()=> {
    setRecipient(null);
    setChatRoom(null)
    const getMessages = async() => {
      try{
        const response = await fetch('api/getMessages', {
          method: 'POST',
          body: JSON.stringify(selectedConversation)
        })
        if(response.ok){
          const conversation: prevGroupMessObj = await response.json()
          if(conversation.messages[0].recipient !== null){
            setRecipient(conversation.messages[0].recipient);
          };
          if(conversation.messages[0].roomId !== null){
            setChatRoom(conversation.messages[0].roomId);
            setRecipient(conversation.messages[0].recipient)
          }
        }
      }catch(error){
        console.log(error);
      }
    }
    getMessages();
    socket.on('activeTypeMessage', () => {
      setTimeout(() => {
        handleStopTyping();
      },3000)
    })
  },[selectedConversation])

    const handleInput = (e: any) => {
        setMessage(e.target.value)
        socket.emit('activeTyping', user?.username);
        setIsTypeMessage(true);
       }
       const handleStopTyping = () => {
        setIsTypeMessage(false);
       }
    

    const sendSocketEvent = async(e:any) => {
      e.preventDefault();
       const messageObj = {
        user : user?.id,
        message: message,
        socketId: socket.id,
        roomId: chatRoom,
        recipient: recipient,
      }
      
      console.log('message object:', messageObj); 
        if(message && socket){
          console.log('message obj: ',messageObj);
          try{
            const response = await fetch('api/messages', {
              method: 'POST',
              body: JSON.stringify(messageObj)
            })
            if(response.ok){
              socket.emit('messageEvent', messageObj);
            }
          }catch(error){
            console.log(error);
          }finally {
            setIsTypeMessage(false);
            setMessage('')
          }
        }else{
            console.log('no message');
       }
    }

  
  return (
    <div className='px-6 mb-4'>
      {isTypeMessage && (
        <p>{user?.username} is trying...</p>
      )}
      <form 
      className="w-full h-auto flex gap-2 mb-8"
      onSubmit={sendSocketEvent}>
        <input 
        type="text" 
        placeholder="Type here" 
        className="input input-bordered w-[90%] bg-[#424549] text-white" 
        value={message}
        onChange={handleInput}
        />
        <button 
        className="bg-[#424549] rounded lg:w-[10%] text-white"
        type="submit">
          Send
        </button>
      </form>
    </div>
  )
}

export default NewMessage
