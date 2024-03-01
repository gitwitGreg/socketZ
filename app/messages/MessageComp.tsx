'use client'
import React, { useEffect, useState } from "react"
import PreviousMessages from "../PreviousMessages/page";
import NewMessage from "../NewMessage/Page";
import Welcome from "../Welcome/page";


export interface UserAccount {
    username:  String,
    id:     String 
    email:      String,
    name:      String, 
    password:    String,
}



export default function MessageComp(data: {socket: any, user: UserAccount| undefined, selectedConvo: string | null}){
  const [newSelected, setNewSelected] = useState(data.selectedConvo);
  useEffect(() => {
    setNewSelected(data.selectedConvo);
  },[data.selectedConvo])



  if(!data.socket || !data.user){
    return(
      <div className="h-screen w-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if(!data.selectedConvo){
    return (
      <Welcome />
    )
  }

  return(
    <div className="flex flex-col gap-10 w-full h-auto">
      <PreviousMessages
      conversationId={newSelected}
      user={data.user}
      socket={data.socket}/>
      <NewMessage
      user={data.user}
      socket={data.socket}
      selectedConversation={data.selectedConvo}/>
    </div>

    )
}