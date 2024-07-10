import nodemailer from "nodemailer";
import { assert } from "console";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma: PrismaClient = new PrismaClient();
export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();
        const documentLog = await prisma.document_log.findUnique({
            select: {
              account_id: true
            },
            where: {
              id: id
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
        return NextResponse.json(
            { message: "SendMail Success", data: "" },
            { status: 200 }
          );
    } catch (error: unknown) {
        console.log(error)
        return NextResponse.json(
          { message: "SendMail Unsuccess", data: error },
          { status: 500 }
        );
      }
}