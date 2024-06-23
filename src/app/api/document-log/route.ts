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

    // ตรวจสอบการมีอยู่ของเอกสาร
    const debound = await prisma.document_log.findUnique({
      select: { account_id: true },
      where: { id, NOT: { account_admin_id: null } },
    });

    if (debound) {
      return NextResponse.json({ message: "POST Unsuccess", data: "" }, { status: 500 });
    }

    // หาข้อมูลผู้ดูแล
    const accountAdmin = await prisma.account_admin.findUnique({
      select: { id: true },
      where: { email },
    });

    if (notation) {
      await prisma.document_log.update({
        data: {
          status: "REJECT",
          notation,
          account_admin_id: accountAdmin?.id,
        },
        where: { id },
      });
    } else {
      await prisma.document_log.update({
        data: {
          status: "APPROVE",
          notation: "ยินดีต้อนรับ!! ท่านได้เป็นสมาชิกชมรม",
          account_admin_id: accountAdmin?.id,
        },
        where: { id },
      });

      // รวมข้อมูลที่ต้องการเข้าด้วยกันเพื่อลดคำสั่งฐานข้อมูล
      const documentLog = await prisma.document_log.findUnique({
        select: { account_id: true },
        where: { id },
      });

      if (documentLog) {
        await prisma.$transaction([
          prisma.account.update({
            data: { role: "CERTIFIED" },
            where: { id: documentLog.account_id },
          }),
          prisma.account.findUnique({
            select: { email: true },
            where: { id: documentLog.account_id },
          }),
        ]).then(async ([_, accountEmail]) => {
          const transporter = nodemailer.createTransport({
            host: "web1.vpshispeed.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.SIMPLE_MAIL_TRANSFER_PROTOCOL_USERNAME,
              pass: process.env.SIMPLE_MAIL_TRANSFER_PROTOCOL_PASSWORD,
            },
          });

          const verify = await transporter.verify();
          assert(verify);

          const mailOptions = {
            from: `"CyberGeekClub" <${process.env.SIMPLE_MAIL_TRANSFER_PROTOCOL_USERNAME}>`,
            to: accountEmail?.email,
            subject: `[CyberGeekClub] ยินดีต้อนรับ!! ท่านได้เป็นสมาชิกชมรม`,
            text: `ท่านได้เป็นสมาชิกชมรม CyberGeekClub สามารถตรวจสอบข้อมูล ข่าวส่ารต่าง ๆ ได้ทางเว็บไซต์`,
          };

          await transporter.sendMail(mailOptions);
        });
      }
    }

    return NextResponse.json({ message: "POST Success", data: "" }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: "POST Unsuccess", data: error }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
