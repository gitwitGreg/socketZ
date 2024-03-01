import { PrismaClient } from "@prisma/client";

export async function POST(req: any, res: any) {
    console.log('starting conversaiton api')
    const body = await req.json();
    const prisma = new PrismaClient();
    try{
        const conversation = await prisma.message.findFirst({
            where: {
                id: body
            }
        })
        if(!conversation) return res.json({error: 'No message with provided Id'}, {status: 404});
        return Response.json(conversation);
    }catch(error){
        console.log(error);
        return Response.json({error: error});
    }
}