import { connectToDb } from "@/lib/mongo";
import { PrismaClient } from "@prisma/client";

export async function POST(req: any, res: any){
    const body = await req.json();
    await connectToDb();
    const prisma = new PrismaClient()
    if(!body) return Response.json({error: 'No user id'})
    try{
        const user = await prisma.user.findFirst({
            where:{
                id: body
            }
        })
        if(!user) return Response.json({error: "No user with provided id"})
        return Response.json(user);
    }catch(error){
        console.log(error);
        return Response.json({error: error})
    }finally{
        if(prisma){
            prisma.$disconnect();
        }
    }
}