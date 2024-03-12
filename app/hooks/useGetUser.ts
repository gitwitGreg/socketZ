import { useEffect, useState } from "react";

export default function useGetUser(id: string) {
    const [user, setUser] = useState<UserAccount | undefined>()
    useEffect(() => {
        const fetchUser = async() => {
            try{
                const respose = await fetch('/api/getUser',{
                    method: 'POST',
                    body: JSON.stringify(id)
                })
                if(respose.ok){
                    const foundUser = await respose.json();
                    setUser(foundUser);
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchUser();
    },[id])
    return {user}
}

