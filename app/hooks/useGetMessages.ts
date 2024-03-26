import { Message } from '@prisma/client'
import {useEffect, useState} from 'react'

export default function useGetMessage(userId: string, socketTrigger: boolean) {

    const [conversations, setConversations] = useState<Message[]>([]);

    const [responseTrigger, setResponseTrigger] = useState(false);

    

    useEffect(() => {
        if(socketTrigger){
            setResponseTrigger(true);
        }
    },[socketTrigger])

    console.log({responseTrigger})

    useEffect(() => {
        const retrieveConversations = async() => {
            if(!userId) return
            try{
                console.log('searching for convo');
                const response = await fetch('api/conversations',{
                    method: 'POST',
                    body: JSON.stringify(userId)
                })
                if(response.ok){
                    const messArray = await response.json()
                    setConversations(messArray);
                    setResponseTrigger(false);

                }else{
                    console.log(response.status);
                }
            }catch(error){
                console.log(error)
            }
        }
        retrieveConversations();

    },[userId, responseTrigger])
    return {conversations, responseTrigger};

}