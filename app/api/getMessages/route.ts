import { PrismaClient } from "@prisma/client";

export async function POST(req: any) {
    const body = await req.json();
    const prisma = new PrismaClient();
    try{
        const message = await prisma.message.findFirst({
            where: {
                id: body
            }
        })
        if(message?.roomId){
            const chatRoom = await prisma.chatRoom.findFirst({
                where: {
                    id: message?.roomId as string
                },
                include: {
                    users: true
                }
            })
            const allMessages = await prisma.message.findMany({
                where: {
                    roomId: chatRoom?.id
                },
                orderBy: [
                    {createdAt: 'asc'}
                ],
                include: {
                    sender: true
                }
            })
            const groupMessobj = {
                messages: allMessages,
                users : chatRoom?.users
            }
            return Response.json(groupMessobj);
        }
        const allMessages = await prisma.message.findMany({
            where: {
                senderId: message?.senderId,
                recipient: message?.recipient
            },
            orderBy: [
                {createdAt: 'asc'}
            ],
            include: {
                sender: true

            }
        })
        if(allMessages){
            return Response.json(allMessages);
        }
    }catch(error){
        console.log(error)
        return Response.json({error: error}, {status: 400})
    }
}