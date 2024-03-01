import { connectToDb } from "@/lib/mongo";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient; 

export const POST = async (req: any, res: any) => {


    try{
        
        const body = await req.json();

        const { email, password } = body;

        console.log('credentials: ',  email, password);

        if(!email || !password) return Response.json({error: 'Missing credentials'});

        await connectToDb();


        const user = await prisma.user.findFirst({

            where: {
                email: email
            }

        })

        if(!user) return Response.json({error: 'No user with existing credentials'});


        return res(user);


    }catch(error){


        return Response.json({error: 'No user with existing credentials'});

    }finally{

        await prisma.$disconnect();

    }



}