import { connectToDb } from "@/lib/mongo";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient; 

export const POST = async (req: any, res: any) => {

    await connectToDb();

    try{
        
        const body = await req.json();

        const { email, password } = body;

        console.log(email, password);

        if(!email || !password) return Response.json({error: 'Missing credentials'});



        const user = await prisma.user.findFirst({

            where: {
                email: email
            }

        })

        console.log('user result', user);

        if(!user) return Response.json({error: 'No user with existing credentials'});

        return Response.json(user);

    }catch(error){

        console.log('catch')
        return Response.json({error: error});

    }finally{

        await prisma.$disconnect();

    }

}