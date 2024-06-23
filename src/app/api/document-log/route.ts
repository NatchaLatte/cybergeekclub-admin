import { PrismaClient } from "@prisma/client";
import { assert } from "console";

import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";

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
    const debound = await prisma.document_log.findUnique({
      select: {
        account_id: true
      },
      where: {
        id: id,
        NOT: {
          account_admin_id: null
        }
      }
    })
    if(debound){
      return NextResponse.json(
        { message: "POST Unsuccess", data: "" },
        { status: 500 }
      );
    }else{
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
            notation: "ยินดีต้อนรับ!! ท่านได้เป็นสมาชิกชมรม",
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
        const accountEmail = await prisma.account.findFirst({
          select: {
            email: true
          },
          where: {
            id: documentLog?.account_id
          }
        })
        const SIMPLE_MAIL_TRANSFER_PROTOCOL_USERNAME = process.env.SIMPLE_MAIL_TRANSFER_PROTOCOL_USERNAME;
        const SIMPLE_MAIL_TRANSFER_PROTOCOL_PASSWORD = process.env.SIMPLE_MAIL_TRANSFER_PROTOCOL_PASSWORD;
        const transporter = nodemailer.createTransport({
          host: "web1.vpshispeed.com",
          port: 587,
          secure: false,
          auth: {
            user: SIMPLE_MAIL_TRANSFER_PROTOCOL_USERNAME,
            pass: SIMPLE_MAIL_TRANSFER_PROTOCOL_PASSWORD,
          },
        });
        const verify = await transporter.verify();
        assert(verify);
        const mailOptions = {
          from: `"CyberGeekClub" ${SIMPLE_MAIL_TRANSFER_PROTOCOL_USERNAME}`,
          to: `${accountEmail?.email}`,
          subject: `[CyberGeekClub] ยินดีต้อนรับ!! ท่านได้เป็นสมาชิกชมรม`,
          text: `ท่านได้เป็นสมาชิกชมรม CyberGeekClub สามารถตรวจสอบข้อมูล ข่าวส่ารต่าง ๆ ได้ทางเว็บไซต์`,
        };
        await transporter.sendMail(mailOptions);
      }
      return NextResponse.json(
        { message: "POST Success", data: "" },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json(
      { message: "POST Unsuccess", data: error },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
