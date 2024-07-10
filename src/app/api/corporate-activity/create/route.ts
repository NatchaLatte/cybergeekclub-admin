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
    Key: `asset/image/banner_activity_th/${v4()}`,
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
    Key: `asset/image/banner_activity_en/${v4()}`,
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
    const start_period = formData.get("start_period") as string
    const end_period = formData.get("end_period") as string
    const banner_th_bytes = await banner_th_file.arrayBuffer()
    const banner_en_bytes = await banner_en_file.arrayBuffer()
    const banner_th_buffer = Buffer.from(banner_th_bytes)
    const banner_en_buffer = Buffer.from(banner_en_bytes)
    const banner_th = await uploadFileToS3BannerTH(banner_th_buffer)
    const banner_en = await uploadFileToS3BannerEN(banner_en_buffer)

    const start_period_format = start_period ? new Date(start_period) : start_period
    const end_period_format = end_period ? new Date(end_period) : end_period
    const createData = await prisma.corporate_activity.create({
      data: {
        id: v4(),
        published_status: false,
        banner_th: banner_th,
        banner_en: banner_en,
        title_th: title_th,
        title_en: title_en,
        particulars_th,
        particulars_en,
        start_period: start_period_format,
        end_period: end_period_format
      }
    })
    
    return NextResponse.json({ message: "Create Success", data: createData }, { status: 200 });
  }catch(error: unknown){
    console.log(error)
    return NextResponse.json({ message: "Create Unsuccess", data: error }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";