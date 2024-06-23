import { PrismaClient, contact } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function POST(request: NextRequest) {
    try{
      const {
        id,
        category,
        display_name,
        uri
      }: contact = await request.json()
      const updateData = await prisma.contact.update({
        data: {
          category,
          display_name,
          uri
        },
        where: {
          id,
        }
      })
      return NextResponse.json({ message: "PUT Success", data: updateData }, { status: 200 });
    }catch(error: unknown){
      console.log(error)
      return NextResponse.json({ message: "PUT Unsuccess", data: error }, { status: 500 });
    }
  }

  export const dynamic = "force-dynamic";