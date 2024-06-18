import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function GET() {
  try {
    const readData = await prisma.document_log.findMany({
      orderBy: [
        {
          built: "desc",
        },
      ],
    });
    const updatedData = await Promise.all(
      readData.map(async (data) => {
        let accountEmail = null;
        let accountAdminEmail = null;
        if (data.account_id) {
          accountEmail = await prisma.account.findUnique({
            select: {
              email: true,
            },
            where: {
              id: data.account_id,
            },
          });
        }
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
          account_email: accountEmail ? accountEmail.email : null,
          account_admin_email: accountAdminEmail
            ? accountAdminEmail.email
            : null,
        };
      })
    );
    return NextResponse.json(
      { message: "GET Success", data: updatedData },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "GET Unsuccess", data: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, email, notation } = await request.json();
    const accountAdmin = await prisma.account_admin.findUnique({
      select: { id: true },
      where: { email: email },
    });
    if (notation) {
      await prisma.document_log.update({
        data: {
          status: "REJECT",
          notation: notation,
          account_admin_id: accountAdmin?.id,
        },
        where: {
          id: id
        }
      })
    } else {
      await prisma.document_log.update({
        data: {
          status: "APPROVE",
          account_admin_id: accountAdmin?.id,
        },
        where: {
          id: id
        }
      })
      const documentLog = await prisma.document_log.findUnique({
        select: {
          account_id: true
        },
        where: {
          id: id
        }
      })
      await prisma.account.update({
        data: {
          role: "CERTIFIED"
        },
        where: {
          id: documentLog?.account_id
        }
      })
    }
    return NextResponse.json(
      { message: "POST Success", data: "" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json(
      { message: "POST Unsuccess", data: error },
      { status: 500 }
    );
  }
}
