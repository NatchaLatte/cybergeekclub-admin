import { PrismaClient, contact } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { v4 } from "uuid";

const prisma: PrismaClient = new PrismaClient();

export async function POST(request: NextRequest) {
  try{
    const {
      category,
      display_name,
      uri
    }: contact = await request.json()
    const createData = await prisma.contact.create({
      data: {
        id: v4(),
        category,
        display_name,
        uri
      }
    })
    return NextResponse.json({ message: "Create Success", data: createData }, { status: 200 });
  }catch(error: unknown){
    console.log(error)
    return NextResponse.json({ message: "Create Unsuccess", data: error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";