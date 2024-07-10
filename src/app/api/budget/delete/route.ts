import { PrismaClient, budget } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function POST(request: NextRequest) {
  try{
    const { id }: budget = await request.json()
    const deleteData = await prisma.budget.delete({
      where: {
        id,
      }
    })
    return NextResponse.json({ message: "DELETE Success", data: deleteData }, { status: 200 });
  }catch(error: unknown){
    console.log(error)
    return NextResponse.json({ message: "DELETE Unsuccess", data: error }, { status: 500 });
  }
}