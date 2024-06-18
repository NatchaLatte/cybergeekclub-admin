import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const readData = await prisma.account.findFirst({
        select: {
            id: true,
            display_name: true,
            student_id: true,
            prefix_th: true,
            prefix_en: true,
            first_name_th: true,
            first_name_en: true,
            middle_name_th: true,
            middle_name_en: true,
            last_name_th: true,
            last_name_en: true,
            nickname_th: true,
            nickname_en: true,
            birthdate: true,
            phone_number: true,
            point: true,
            profile_image: true,
            faculty_th: true,
            faculty_en: true,
            major_th: true,
            major_en: true,
            code: true,
            role: true,
            banned: true,
            remaining_time: true
        },
        where: {
            id: params.id
        }
    })
    return NextResponse.json(
      { message: "GET success.", data: readData },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: "GET failed.", data: error },
      { status: 500 }
    );
  }
}
