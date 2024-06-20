import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function GET() {
  try{
    const readData = await prisma.corporate_activity.findMany({
      select: {
        id: true,
        published_status: true,
        banner_en: true,
        banner_th: true,
        title_en: true,
        title_th: true,
        particulars_en: true,
        particulars_th: true,
        start_period: true,
        end_period: true
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

export const dynamic = "force-dynamic";