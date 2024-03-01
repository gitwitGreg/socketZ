import { connectToDb } from "@/lib/mongo";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";


type roomObj = {
    roomName : string,
    userId: string,
    create: boolean
}

export async function POST(req: any, res: any) {
    const body: roomObj = await req.json()
    console.log('body object: ', body);
    if(!body) return res.status(200).send('Internal Server Error');
    await connectToDb();
    try{
        const prisma = new PrismaClient;
        if(body.create === true){
            const existingRoom =  await prisma.chatRoom.findFirst({
                where: {
                    name: body.roomName
                }
            })
            if(existingRoom === null){
                const newRoom = await prisma.chatRoom.create({
                    data: {
                        name: body.roomName,
                        userIds: [body.userId],
                    }
                })
                await prisma.message.create({
                    data: {
                        content: 'Hi, Welcome to my ChatRoom!',
                        senderId: body.userId,
                        recipient: body.roomName,
                        roomId: newRoom.id
                    }
                })
                return Response.json(newRoom)
            }else{
                return Response.json({error: 'Room name already in use'});
            }
        }else{
            const existingRoom = await prisma.chatRoom.findFirstOrThrow({
                where: {
                    name: body.roomName
                }
            })
            if(existingRoom.userIds.includes(body.userId)){
                return Response.json({error: 'User alreay in chatroom'});
            }
            const updatedRoom = await prisma.chatRoom.update({
                where: {
                    id: existingRoom.id
                },
                data: {
                    userIds: [...existingRoom.userIds, body.userId]
                }
            })
            if(!updatedRoom){
                return Response.json({message: 'Room does not exsist'});
            }else{
                console.log('User was able to join room');
                return Response.json(updatedRoom);
            }
        }
    }catch(error){
        console.log(error);
        return Response.json({ error: 'Internal Server Error' });
    }
}