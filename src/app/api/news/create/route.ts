import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { v4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const prisma: PrismaClient = new PrismaClient();
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function uploadFileToS3BannerTH(
  file: ArrayBuffer,
) {
  const fileBuffer = file;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `asset/image/banner_news_th/${v4()}`,
    Body: Buffer.from(fileBuffer),
    ContentType: "image/jpeg" || "image/png",
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  const objectUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  return objectUrl;
}

async function uploadFileToS3BannerEN(
  file: ArrayBuffer,
) {
  const fileBuffer = file;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `asset/image/banner_news_en/${v4()}`,
    Body: Buffer.from(fileBuffer),
    ContentType: "image/jpeg" || "image/png",
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  const objectUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  return objectUrl;
}

export async function POST(request: NextRequest) {
  try{
    const formData = await request.formData()
    const banner_th_file = formData.get("banner_th") as unknown as File
    const banner_en_file = formData.get("banner_en") as unknown as File
    const title_th = formData.get("title_th") as string
    const title_en = formData.get("title_en") as string
    const particulars_th = formData.get("particulars_th") as string
    const particulars_en = formData.get("particulars_en") as string
    const time_series = formData.get("time_series") as string
    const banner_th_bytes = await banner_th_file.arrayBuffer()
    const banner_en_bytes = await banner_en_file.arrayBuffer()
    const banner_th_buffer = Buffer.from(banner_th_bytes)
    const banner_en_buffer = Buffer.from(banner_en_bytes)
    const banner_th = await uploadFileToS3BannerTH(banner_th_buffer)
    const banner_en = await uploadFileToS3BannerEN(banner_en_buffer)
    const email = formData.get("email") as string
    const accountAdmin = await prisma.account_admin.findUnique({
      select: { id: true },
      where: { email: email },
    });
    if(!accountAdmin){
      throw "Account not found!"
    }
    const time_series_format = time_series ? new Date(time_series) : time_series
    const createData = await prisma.news.create({
      data: {
        id: v4(),
        published_status: false,
        banner_th: banner_th,
        banner_en: banner_en,
        title_th: title_th,
        title_en: title_en,
        particulars_th,
        particulars_en,
        time_series: time_series_format,
        account_admin_id: accountAdmin.id
      }
    })
    
    return NextResponse.json({ message: "Create Success", data: createData }, { status: 200 });
  }catch(error: unknown){
    console.log(error)
    return NextResponse.json({ message: "Create Unsuccess", data: error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";