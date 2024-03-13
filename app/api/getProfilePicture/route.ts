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

       const downloadStream = bucket.openDownloadStream(objectId); 

       const chunks: Uint8Array[] = [];

       downloadStream.on('data', (chunk) => {
           chunks.push(chunk);
       });

       // Create a promise to wait for the download stream to end
       const streamEndPromise = new Promise<void>((resolve, reject) => {
           downloadStream.on('end', () => {
               resolve();
           });

           downloadStream.on('error', (error) => {
               console.error('Error fetching file:', error);
               reject(error);
           });
       });

       // Wait for the download stream to end
       await streamEndPromise;

       // Concatenate the chunks into a single buffer
       const fileBuffer = Buffer.concat(chunks);
       const base64String = fileBuffer.toString('base64'); // Convert buffer to base64 string

       // Send the response
       return Response.json({ file: base64String });
    }catch(error){
        console.log(error);
        return Response.json({error: error, status: 500});
    }
}