import { Message, PrismaClient } from "@prisma/client";

export async function POST(req:any, res: any){
    const body = await req.json();
    const prisma = new PrismaClient;
    try{
        const conversations = await prisma.message.findMany({
            where:{
                OR:[
                    {senderId: body},
                    {recipient: body}
                ]
            }
        
        })
        const uniqueConvos: {[key:string]: Message} = {};
        conversations.forEach((conversation) => {
            const key = conversation.senderId === body? conversation.recipient: conversation.senderId;
            if(!uniqueConvos[key]){
                uniqueConvos[key] = conversation
            }
        });
        
        const result = Object.values(uniqueConvos);
        if(!result || result.length === 0){
            return Response.json({error: 'NO previous conversations'});
        }
        return Response.json(result);

    }catch(error){
        console.log(error);
        return Response.json({error:error}, {status: 400})
    }

}