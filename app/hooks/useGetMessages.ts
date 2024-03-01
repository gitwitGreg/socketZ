import { Message } from '@prisma/client'
import {useEffect, useState} from 'react'

export default function useGetMessage(userId: string) {
    const [conversations, setConversations] = useState<Message[]>([])
    useEffect(() => {
        const retrieveConversations = async() => {
            if(!userId) return
            try{
                const response = await fetch('api/conversations',{
                    method: 'POST',
                    body: JSON.stringify(userId)
                })
                if(response.ok){
                    const messArray = await response.json()
                    setConversations(messArray);
                }else{
                    console.log(response.status);
                }
            }catch(error){
                console.log(error)
            }
        }
        retrieveConversations();
    },[userId])
    return {conversations};
}