import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function GET() {
  try{
    const readData = await prisma.news.findMany({
      select: {
        id: true,
        published_status: true,
        banner_en: true,
        banner_th: true,
        title_en: true,
        title_th: true,
        particulars_en: true,
        particulars_th: true,
        time_series: true,
        account_admin_id: true
      },
      orderBy: [
        {
          built: 'desc',
        },
      ]
    })
    const updatedData = await Promise.all(
      readData.map(async (data) => {
        let accountAdminEmail = null;
        if (data.account_admin_id) {
          accountAdminEmail = await prisma.account_admin.findUnique({
            select: {
              email: true,
            },
            where: {
              id: data.account_admin_id,
            },
          });
        }

        return {
          ...data,
          account_admin_email: accountAdminEmail
            ? accountAdminEmail.email
            : null,
        };
      })
    );
    return NextResponse.json({ message: "GET Success", data: updatedData }, { status: 200 });
  }catch(error: unknown){
    return NextResponse.json({ message: "GET Unsuccess", data: error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";