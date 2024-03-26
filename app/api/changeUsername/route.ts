import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest){

    const body  = await req.json();


    const {userId, newUsername} = body;

    if(newUsername === ''){
        return Response.json({eror: 'missing username'});
    }

    
    const prisma = new PrismaClient();

    try{
        
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username: newUsername
            }
        })

        return Response.json({status: 200});
        
    }catch(error){
        return Response.json({error: error, status: 500});
    }finally{
        if(prisma){
            prisma.$disconnect();
        }
    }
}