import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';



let isConnected = false;

export const connectToDb = async () => {
  if(isConnected){
      return;
  }
  try{
      await mongoose.connect(process.env.DATABASE_URL as string,{
          dbName: 'database',
        })
      isConnected = true;
  }catch(error){
      console.log(error)
  }
}

export const connectToStorage = async() => {
  try{
    const connection = mongoose.connection;
    console.log('connection made');
    const bucket = new mongoose.mongo.GridFSBucket(connection.db)
    if(!bucket){
      console.log('Error connecting to bucket');
    }
    console.log('bucket made');
    return bucket
  }catch(error){
    console.log(error)
  }
}
