import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function POST(request: NextRequest) {
  try{
    const { id } = await request.json()
    console.log(id)
    const readData = await prisma.activity_calendar.findFirst({
        where: {
            id: id
        }
    })
    return NextResponse.json({ message: "GET Success", data: readData}, { status: 200 });
  }catch(error: unknown){
    return NextResponse.json({ message: "GET Unsuccess", data: error }, { status: 500 });
  }
}