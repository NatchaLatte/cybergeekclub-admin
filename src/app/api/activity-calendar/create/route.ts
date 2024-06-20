import { PrismaClient, activity_calendar } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { v4 } from "uuid";

const prisma: PrismaClient = new PrismaClient();

export async function POST(request: NextRequest) {
  try{
    const {
      particulars_th,
      particulars_en,
      start_period,
      end_period
    }: activity_calendar = await request.json()
    const start_period_format = start_period ? new Date(start_period) : start_period
    const end_period_format = end_period ? new Date(end_period) : end_period
    const createData = await prisma.activity_calendar.create({
      data: {
        id: v4(),
        particulars_th,
        particulars_en,
        start_period: start_period_format,
        end_period: end_period_format
      }
    })
    return NextResponse.json({ message: "Create Success", data: createData }, { status: 200 });
  }catch(error: unknown){
    console.log(error)
    return NextResponse.json({ message: "Create Unsuccess", data: error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";