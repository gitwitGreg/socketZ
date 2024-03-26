import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {

    const body = await req.json();

    if(!body) throw Error;

    const { recipient, message, senderId } = body;

    const prisma = new PrismaClient();

    try{

        const recipientAccount = await prisma.user.findUniqueOrThrow({
            where: {
                username: recipient
            }
        })


        if(!recipientAccount){
            return Response.json({error: 'NO user with given username'}, {status: 404})
        }

        await prisma.message.create({
            data: {
                recipient: recipientAccount.username,
                content: message,
                senderId: senderId
            }
        })

        return Response.json({status: 201});

    }catch(error){
        return Response.json({error: error})
    }finally{
        if(prisma){
            await prisma.$disconnect();
        }
    }
}