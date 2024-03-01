import mongoose from 'mongoose';
import { MongoClient, GridFSBucket } from 'mongodb';

let isConnected = false;

export const connectToDb = async () => {
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(process.env.DATABASE_URL as string),
      {
        dbName: 'database',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};

export const connectToStorage = () => {
  const client = new MongoClient(process.env.DATABASE_URL as string);
  try {
    client.connect();
    const db = client.db('4later');
    const bucket = new GridFSBucket(db);
    return bucket
  } catch (error) {
    console.log(error);
  }finally{
    client.close();
  }
};
