'use client'
import React, { useState, useEffect } from 'react'
import { UserAccount } from '../messages/MessageComp'
import { Message } from '@prisma/client';

const NewMessage = ( data: {socket: any, user: UserAccount| undefined, selectedConversation: string}) => {
  const [ message, setMessage ] = useState<string>('');
  const [ isTypeMessage, setIsTypeMessage ] = useState<boolean>(false);
  const [recipiant, setRecipiant] = useState<string>('')
  const [chatRoom, setChatRoom] = useState<string>('');


  useEffect(()=> {
    const getMessages = async() => {
      try{
        const response = await fetch('api/getMessages', {
          method: 'POST',
          body: JSON.stringify(data.selectedConversation)
        })
        if(response.ok){
          const conversation: Message[] = await response.json()
          if(conversation[0].recipient){
            setRecipiant(conversation[0].recipient);
          };
          if(conversation[0].roomId){
            setChatRoom(conversation[0].roomId);
            setRecipiant(conversation[0].roomId);
          }
        }
      }catch(error){
        console.log(error);
      }
    }
    getMessages();
    data.socket.on('activeTypeMessage', (data: any) => {
      setTimeout(() => {
        handleStopTyping();
      },3000)
    })
  },[])

    const handleInput = (e: any) => {
        setMessage(e.target.value)
        data.socket.emit('activeTyping', data.user?.username);
        setIsTypeMessage(true);
       }
       const handleStopTyping = () => {
        setIsTypeMessage(false);
       }
    

    const sendSocketEvent = async(e:any) => {
      e.preventDefault();
      console.log(data.socket);
       const messageObj = {
        user : data.user?.id,
        message: message,
        socketId: data.socket.id,
        roomId: chatRoom,
        recipient: recipiant,
      }
        if(message && data.socket){
          console.log('message obj: ',messageObj);
          try{
            const response = await fetch('api/messages', {
              method: 'POST',
              body: JSON.stringify(messageObj)
            })
            if(response.ok){
              data.socket.emit('messageEvent', messageObj);
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
        <p>{data.user?.username} is trying...</p>
      )}
      <form 
      className="w-full h-auto flex gap-2"
      onSubmit={sendSocketEvent}>
        <input 
        type="text" 
        placeholder="Type here" 
        className="input input-bordered w-[90%] bg-[#424549] text-white" 
        value={message}
        onChange={handleInput}
        />
        <button 
        className="bg-[#424549] rounded w-[10%] text-white"
        type="submit">
          Send
        </button>
      </form>
    </div>
  )
}

export default NewMessage
