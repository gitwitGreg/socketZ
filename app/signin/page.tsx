'use client'
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signInformSchema } from "../validation/form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import logo from '../../public/logo.png'
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import Link from "next/link"
import logPic from '@/public/mj.jpeg'



export default function SignIN() {

    const router = useRouter();

    const form = useForm<z.infer<typeof signInformSchema>>({
        resolver: zodResolver(signInformSchema),
        defaultValues: {
          email: "",
          password: '',
        },
    })

    async function onSubmit(values: z.infer<typeof signInformSchema>) {

        try {

            const res = await fetch('api/auth/signIn', {

                method: "POST",

                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify(values)

            })

            if (res.ok){
                await router.push('/');
            }


            signIn('credentials', {

                ...values,
                redirect: false

            });


        }catch(error){
            console.log(error);
        }

    }

    return(
        <div className="flex">

            <div className="flex flex-col itmes-center justify-center p-30 h-screen w-full sm:p-0">

                <div className= "p-20 items-center justify-center rounded-xl py-32 bg-black  w-[50%] m-[25%] h-full flex flex-col text-start">

                    <div className="flex gap-4 items-center justify-center mb-10">

                        <Image   
                        src={logo}
                        height={100}
                        width={100}
                        alt="logo"
                        />

                        <span className="text-white text-4xl tracking-tight font-extrabold">
                            Active                           
                        </span>

                    </div>
                    
                    <h1 className="text-white items-center justify-center flex text-4xl">
                        Sign In
                    </h1>

                    <Form {...form}>

                            <form onSubmit={form.handleSubmit(onSubmit)} 

                            className="space-y-8">
                                <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input 
                                    className="w-full"
                                    placeholder="Enter email" 
                                    {...field} 
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
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                    <Input 
                                    type='password'
                                    placeholder="Enter password" 
                                    {...field} 
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

                        <Link href="/register">

                            <button className="text-white my-6 gap-4 text-xl">
                                
                                Dont have an account?
                                <span className="ml-4 text-blue-500">
                                    Register
                                </span>

                            </button>

                        </Link>
                        
                </div>
            </div>
    </div>

    )

}
