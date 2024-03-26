import { NextRequest, NextResponse } from "next/server";
import { connectToDb, connectToStorage } from "@/lib/mongo";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";


export async function POST(req: NextRequest, res: NextResponse){
    await connectToDb();
    const prisma = new PrismaClient;

    const body = await req.formData();

    const file: File | null = body.get('picture') as unknown as File;

    const userId : string = body.get('userId') as unknown as string;

    try{

        if(!file){
            return Response.json({error: 'Missing file', status: 400});
        }
    
        const bytes = await file.arrayBuffer();

        const filePath = (new Date().getTime())  + '-' + file.name

        const buffer = Buffer.from(bytes);

        const bucket = await connectToStorage();

        const uploadStream = bucket?.openUploadStream(filePath, {
            chunkSizeBytes: 1048576,
        });

        if(uploadStream){

            uploadStream.write(buffer);
            const picId = uploadStream.id.toString();

            uploadStream.end();

            const user = await prisma.user.findFirst({
                where: {
                    id: userId
                }
            })

            const oldProfilePic = user?.picture;
            const objId = new ObjectId(oldProfilePic);

            await bucket?.delete(objId);


            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    picture: picId
                }
            })
            return Response.json({fileId: picId, status: 200, fileName: filePath});

        }else{
            return Response.json({error: 'No upload stream'});
        }

    }catch(error){
        console.log(error);
        return Response.json({error: error});
    }finally{
        if(prisma){
            prisma.$disconnect();
        }
    }

}