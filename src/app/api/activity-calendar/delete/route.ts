import { PrismaClient, activity_calendar } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function POST(request: NextRequest) {
  try{
    const { id }: activity_calendar = await request.json()
    const deleteData = await prisma.activity_calendar.delete({
      where: {
        id,
      }
    })
    return NextResponse.json({ message: "DELETE Success", data: deleteData }, { status: 200 });
  }catch(error: unknown){
    return NextResponse.json({ message: "DELETE Unsuccess", data: error }, { status: 500 });
  }
}