'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signUpformSchema } from "../validation/form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import logo from '../../public/logo.png'
import Image from "next/image"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import ppic from '../../public/ppic.png'
import Link from "next/link"


export default function SignIN() {
    

    const router = useRouter();


    const form = useForm<z.infer<typeof signUpformSchema>>({

        resolver: zodResolver(signUpformSchema),

        defaultValues: {
          email: "",
          password: '',
          name: '',
          username: ''
        },

    })


    async function onSubmit(values: z.infer<typeof signUpformSchema>) {
        
        try {

            const userCredentials = {
                username: values.username,
                password: values.password,
                name: values.name,
                email: values.email,
                picture: String(ppic.src)
            }

            const res = await fetch('api/auth/register', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify(userCredentials)
            });

            console.log('before push')
            if(res.ok) router.push('/')
            
            signIn('credentials',{
              ...values,
              redirect: false
            })

            console.log('after sign-in');

        }catch(error){

            console.log(error);
        }
    }

    return(
        <div className="flex">

            <div className="flex flex-col itmes-center justify-center p-30 h-screen w-full sm:p-0 my-10">

                <div className= "p-20 items-center justify-center rounded-xl py-32 bg-black  w-[50%] m-[25%] h-full flex flex-col text-start">

                    <div className="flex gap-4 items-center justify-center mb-10 ml-[-40px]">
                        
                        <Image   
                        src={logo}
                        height={100}
                        width={100}
                        alt="logo"
                        />

                        <span className="text-white text-4xl tracking-tight font-extrabold">
                            4Later
                        </span>

                    </div>

                    <h1 className="text-white items-center justify-center flex text-4xl">
                    Register
                    </h1>

                    <Form {...form}>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input 
                                    placeholder="Enter an email" {...field} 
                                    />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                
                            </form>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                    <Input 
                                    placeholder="Enter a username" {...field} 
                                    />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />

                            </form>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                    <Input 
                                    placeholder="Enter your name" {...field} 
                                    />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />

                            </form>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                    <Input 
                                    type='password'
                                    placeholder="Enter password" {...field} 
                                    />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <Button 
                                type="submit" 
                                size='lg'
                                className="bg-blue-500">
                                    Submit
                                </Button>
                                
                            </form>

                        </Form>
                        <Link href="/signin">

                            <button className="text-white my-6 gap-4 text-xl">
    
                                Already have an account?
                                 <span className="ml-4 text-blue-500">
                                    Signin
                                </span>

                            </button>

                        </Link>
                </div>
            </div>
    </div>

    )
}
