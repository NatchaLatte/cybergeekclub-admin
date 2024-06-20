import { PrismaClient, activity_calendar } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function POST(request: NextRequest) {
    try{
      const {
        id,
        particulars_en,
        particulars_th,
        start_period,
        end_period
      }: activity_calendar = await request.json()
      const start_period_format = start_period ? new Date(start_period) : start_period
      const end_period_format = end_period ? new Date(end_period) : end_period
      const updateData = await prisma.activity_calendar.update({
        data: {
          particulars_en,
          particulars_th,
          start_period: start_period_format,
          end_period: end_period_format
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