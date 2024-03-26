import { connectToStorage } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import JSZip from "jszip";


export async function POST(req: NextRequest){

    const body: {[key: string]: string}  = await req.json()

    const zip = new JSZip();

    if(body === undefined){
        return Response.json({error: 'Did not recive userIds'});
    }

    const bucket = await connectToStorage();

    try{

        for(const key in body){

            const id = new ObjectId(body[key])

            const downloadStream = bucket?.openDownloadStream(id)

            console.log(downloadStream?.readable);


            if(!downloadStream ){
                console.log('error getting download stream');
            }

        

            downloadStream?.start();
        }

        return new Response();

    }catch(error){
        console.log(error);
        return Response.json({error: error});
    }

}