import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function GET() {
  try{
    const readData = await prisma.contact.findMany({
      select: {
        id: true,
        category: true,
        display_name: true,
        uri: true,
      },
      orderBy: [
        {
          built: 'desc',
        },
      ]
    })
    return NextResponse.json({ message: "GET Success", data: readData}, { status: 200 });
  }catch(error: unknown){
    return NextResponse.json({ message: "GET Unsuccess", data: error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";