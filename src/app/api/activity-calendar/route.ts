import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function POST() {
  try{
    const readData = await prisma.activity_calendar.findMany({
      select: {
        id: true,
        start_period: true,
        end_period: true,
        particulars_en: true,
        particulars_th: true
      },
      orderBy: [
        {
          start_period: 'asc',
        },
      ]
    })
    return NextResponse.json({ message: "GET Success", data: readData, test: new Date().getMilliseconds()}, { status: 200 });
  }catch(error: unknown){
    return NextResponse.json({ message: "GET Unsuccess", data: error }, { status: 500 });
  }
}