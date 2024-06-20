import { PrismaClient, corporate_activity } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const prisma: PrismaClient = new PrismaClient();
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function deleteFileFromS3BannerTH(file_id: string | undefined) {
  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: `asset/image/banner_activity_th/${file_id}`,
  };
  await s3Client.send(new DeleteObjectCommand(params));
}

async function deleteFileFromS3BannerEN(file_id: string | undefined) {
  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: `asset/image/banner_activity_en/${file_id}`,
  };
  await s3Client.send(new DeleteObjectCommand(params));
}

export async function POST(request: NextRequest) {
  try {
    const { id }: corporate_activity = await request.json();
    const banner = await prisma.corporate_activity.findUnique({
      select: {
        banner_th: true,
        banner_en: true,
      },
      where: {
        id: id,
      },
    });
    if (banner) {
      if (banner?.banner_th) {
        await deleteFileFromS3BannerTH(banner.banner_th.split("/").pop());
      }
      if (banner?.banner_en) {
        await deleteFileFromS3BannerEN(banner.banner_en.split("/").pop());
      }
    }
    const deleteData = await prisma.corporate_activity.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(
      { message: "DELETE Success", data: deleteData },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: "DELETE Unsuccess", data: error },
      { status: 500 }
    );
  }
}
