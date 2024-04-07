import { connectToStorage } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest, res: NextResponse){
    const body = await req.json();
    const objectId = new ObjectId(body.fileId)
    try{
       const bucket = await connectToStorage();

       if(!bucket){
        return Response.json("Error getting bucket");
       }

       const filesReffrences = bucket.find(objectId);
       const imageFile = await filesReffrences.next();
    

       if(!imageFile){
        return Response.json({error: 'No File'});
       }

       const downloadStream = bucket.openDownloadStream(objectId);
       downloadStream.start()

       
       const myResponse = new Response(downloadStream as any)

       return myResponse;


    }catch(error){
        console.log(error);
        return Response.json({error: error, status: 500});
    }
}