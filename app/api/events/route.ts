import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

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

        const file=formdata.get("image") as File;
        if(!file)
            return NextResponse.json({message:"Image is required"},{status:400})
        const arraybuffer= await file.arrayBuffer();
        const buffer=Buffer.from(arraybuffer);
        
        const uploadres=await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({resource_type:"image",folder:"events"},(error,result)=>{
                if(error) reject(error);

                resolve(result);
            }).end(buffer);
        })
        event.image=(uploadres as {secure_url:string}).secure_url;
        
        const createdEvent= await Event.create(event);
        return NextResponse.json({message:"Event created successfully",event:createdEvent},{status:201})
    } catch(error){
        console.log(error);
        return NextResponse.json({message:error},{status:500})
    }

}