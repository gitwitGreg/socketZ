import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function PUT(req: NextRequest){

    const body = await req.json()

    const { userId, newPass } = body;

    const prisma = new PrismaClient();

    try{

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: newPass
            }
        })
        
        return Response.json({status: 200});

    }catch(error){
        return Response.json({error: error}, {status: 500});
    }finally{
        if(prisma){
            prisma.$disconnect();
        }
    }
}