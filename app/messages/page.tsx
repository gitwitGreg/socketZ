'use client'
import { useEffect, useMemo, useState } from "react";
import Conversations from "../conversations/page"
import MessageComp from "./MessageComp"
import { useSession } from "next-auth/react";
import { io } from "socket.io-client"
import useGetMessage from "../hooks/useGetMessages";

export default function Page(){
    const [foundUser, setFoundUser] = useState<UserAccount>();
    const {conversations} = useGetMessage(foundUser?.id as string)
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  
    const session = useSession();

    const onSelectConversation = (conversationId: string) => {
      if(!conversationId) return;
      if(conversationId !== undefined){
        setSelectedConversation(conversationId)
      }
    }

    const getUserDetails = async() => {
     if (session.status === 'loading') {
       return;
     }
     if(foundUser){
       return;
     }
     if (session) {
       try {
         const res = await fetch('api/user', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(session.data?.user?.email),
         });
         if (res.ok) {
           const user = await res.json();
           return user;
         } else if (res.status === 406) {
           console.log('already found');
           return null;
         } else if (res.status === 404) {
           console.log('no user to find');
           return null;
         } else {
           console.log('no user found');
           throw Error;
         }
       } catch (error) {
         console.log(error);
       }
     } else {
       console.log('no session');
     }
   };
   
 
   const socket = useMemo(() => io('http://localhost:3000'), []);
 
   useEffect(() => {
     if(session.status === 'loading'){
         return;
     }
     const fetchUserAndEmmit = async () => {
         const user: UserAccount = await getUserDetails();
         if(!user) return null;
         if(foundUser !== user){
             setFoundUser(user);
             return;
         }
     }
     fetchUserAndEmmit();
     socket.connect();  
     return () => {
        socket.disconnect();
     };
 },[session, foundUser]);
 

    if(foundUser && socket.id){
       const userObj = {
         user: foundUser,
         socketId: socket.id
       }
       socket.emit('userInfo', userObj);
   }



   if(!foundUser || !socket|| !socket.connected){
    return(
      <div className="h-screen w-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
   }



    return(
        <div className="flex h-auto w-full bg-[#1e2124] text-white">
          <Conversations
          conversations={conversations}
          onSelectConversation={onSelectConversation}/>
          <MessageComp 
            socket={socket}
            user={foundUser}
            selectedConvo={selectedConversation}
          />
        </div>
    )
}