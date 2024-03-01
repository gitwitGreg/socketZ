import { connectToDb } from "@/lib/mongo"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async (req: any, res: any) => {
    
    try{

        const body = await req.json();

        const { email, username, password, name } = body;

        await connectToDb();


        if(!email || !username || !password || !name ){
            return Response.json({error: 'Missing Credentials'}, {status: 400})
        }

        const exsistingUser = await prisma.user.findFirst({
            where: {
                email: email,
                password: password,
            }
        })

        if(exsistingUser) return Response.json({error: 'Email already in use'});

        const user = await prisma.user.create({
            data: {
                username: username,
                password: password,
                email: email,
                name: name,
                picture: '',
            }
        })

        if(!user)return Response.json({error: 'Error Crreating user'});

        return res(user);

    }catch(error){

        console.log(error);

        return Response.json({error: 'Failed to create User'}, {status: 300});

    }finally{

        await prisma.$disconnect();
        
    }
}