import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req:NextRequest){
    try{
        await connectDB();
        const formdata= await req.formData();   //in next it is formdata not body like express

        let event;
        try {
            event= Object.fromEntries(formdata);
        } catch (error) {
            return NextResponse.json({message:error},{status:400})
        }

        const createdEvent= await Event.create(event);
        return NextResponse.json({message:"Event created successfully",event:createdEvent},{status:201})
    } catch(error){
        console.log(error);
        return NextResponse.json({message:error},{status:500})
    }

}