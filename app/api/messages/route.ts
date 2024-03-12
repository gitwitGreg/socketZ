import { connectToDb } from "@/lib/mongo";
import { PrismaClient, User } from "@prisma/client";

type messageProp  = {
    user : string,
    message: string,
    socketId: string,
    roomId?: string,
    room?: string;
    recipient: string | undefined,
}

export async function POST(req:any, res:any) {
    await connectToDb();
    const prisma = new PrismaClient;
    const body: messageProp = await req.json();
    if(!body) return res.status(500).send('Internal Server Error');
    try{
        if(body){
            if(body.roomId){
                const chatRoom = await prisma.chatRoom.findFirst({
                    where: {
                        id: body.roomId
                    }
                })
                const roomName = chatRoom?.name
                const newRoom = await prisma.chatRoom.upsert({
                    where: {
                        id: body.roomId as string,
                        name:roomName
                    },
                    create: {
                        name: roomName as string,
                        userIds: [body.user]
                    },
                    update: {
                        name: body.room
                    }
                })
                await prisma.message.create({
                    data: {
                        content: body.message,
                        senderId: body.user,
                        roomId: body.roomId,
                        recipient: roomName as string,
                    },
                    include: {
                        room: true
                    }
                })
                return Response.json(newRoom);
            }
            const newMessage = await prisma.message.create({
                data: {
                    content: body.message,
                    senderId: body.user,
                    recipient: body.recipient as string
                }
            })
            if(newMessage){
                console.log('New message created');
                return Response.json(newMessage);
            }
            else{
                console.log('error making new message')
                throw Error
            }
        }
    }catch(error){
        console.log(error);
        throw error
    }finally{
        if(prisma){
            prisma.$disconnect();
        }
    }
}