import { PrismaClient, expenditure } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function POST(request: NextRequest) {
    try{
      const {
        id,
        particulars_en,
        particulars_th,
        money,
        time_series
      }: expenditure = await request.json()
      const time_series_format = time_series ? new Date(time_series) : time_series
      const updateData = await prisma.expenditure.update({
        data: {
          particulars_en,
          particulars_th,
          money,
          time_series: time_series_format
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