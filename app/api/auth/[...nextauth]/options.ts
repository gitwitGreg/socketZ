import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { connectToDb } from "@/lib/mongo";

const prisma = new PrismaClient();



export const options: NextAuthOptions = {

    providers: [

        CredentialsProvider({
            
            name: 'Credentials',

            credentials:{
                email:{
                    label: 'Email',
                    type: 'text',
                },
                password:{
                    label: 'password',
                    type: 'password'
                },

            },

            async authorize(credentials) {

                if(!credentials?.password || !credentials.email) 
                throw Error('Please enter your email and password');


                await connectToDb();

                try{
                    
                    const user = await prisma.user.findUnique({
                        where: {

                            email: credentials.email
                        }
                    });

                    if(!user || !user.password) throw Error('No user with provide credentials');

                    const isMatch = user.password === credentials.password;


                    if(!isMatch) throw Error('invalid passowrd');

                    return user;

                }catch(error){

                    
                    throw error;

                }
            }
        })
    ],

    pages: {
        signIn: '/signin',
    },

};