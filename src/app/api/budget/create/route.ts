import { PrismaClient, budget } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { v4 } from "uuid";

const prisma: PrismaClient = new PrismaClient();

export async function POST(request: NextRequest) {
  try{
    const {
      category,
      particulars_th,
      particulars_en,
      money,
      time_series,
    }: budget = await request.json()
    const time_series_format = time_series ? new Date(time_series) : time_series
    const createData = await prisma.budget.create({
      data: {
        id: v4(),
        category,
        particulars_th,
        particulars_en,
        money,
        time_series: time_series_format,
      }
    })
    return NextResponse.json({ message: "Create Success", data: createData }, { status: 200 });
  }catch(error: unknown){
    console.log(error)
    return NextResponse.json({ message: "Create Unsuccess", data: error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";