import { connectToDb } from "@/lib/mongo";
import { PrismaClient } from "@prisma/client";

export const POST = async (req: any, res: any) => {
    const isError = await req.json? false: true;
    if(isError){
        return Response.json({error: 'Empty sting'}, {status: 406})
    }
    const body = await req.json();
    const email = body;
    try{
        await connectToDb();
        const prisma = new PrismaClient();
            if(email){
                const emailType = typeof email
                if(emailType !== 'string' ) return res.status(404).send('invalid username')
                const userAccount = await prisma.user.findFirst({
                    where: {
                        email: String(email)
                    }
                })
                return Response.json(userAccount);
            }else{
                return Response.json({error: 'session did not make it to server'})
            }
    }catch(error){
        console.error('Error:', error);
        return Response.json({error: 'error finding in database'});
    }
} 
