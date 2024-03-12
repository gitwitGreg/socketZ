'use client'
import React, { useEffect, useState } from "react"
import PreviousMessages from "../PreviousMessages/page";
import NewMessage from "../NewMessage/Page";
import Welcome from "../Welcome/page";
import { UserAccount } from "../ constants";

export default function MessageComp({socket, user, selectedConvo}: {socket: any, user: UserAccount| undefined, selectedConvo: string | null}){
  const [newSelected, setNewSelected] = useState(selectedConvo);
  useEffect(() => {
    setNewSelected(selectedConvo);
  },[selectedConvo])



  if(!socket || !user){
    return(
      <div className="h-screen w-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if(!selectedConvo){
    return (
      <Welcome
      user={user}/>
    )
  }

  return(
    <div className="flex flex-col gap-10 w-full h-auto">
      <div className="h-[100%] overflow-y-scroll">
        <PreviousMessages
        conversationId={newSelected}
        user={user}
        socket={socket}/>
      </div>
      <NewMessage
      user={user}
      socket={socket}
      selectedConversation={selectedConvo}/>
    </div>

    )
}