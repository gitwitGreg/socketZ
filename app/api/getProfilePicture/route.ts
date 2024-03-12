import { connectToStorage } from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest, res: any){
    const body = await req.json();
    console.log('fileId: ', body)
    try{
       const bucket = await connectToStorage();


       if(!bucket){
        return Response.json("Error getting bucket");
       }

       const downloadStream = bucket.openDownloadStream(body);
      

        downloadStream.on('end', () => {
            console.log('File sent successfully.');
            return Response.json({status: 200});
        });
        downloadStream.on('error', (error) => {
            console.error(error);
            res.json({ error: "Internal Server Error" });
        });

        downloadStream.pipe(res);

    }catch(error){
        console.log(error);
        return Response.json({error: error});
    }
}