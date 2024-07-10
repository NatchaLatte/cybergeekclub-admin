import { PrismaClient, corporate_activity } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { v4 } from "uuid";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

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
    try{
      const formData = await request.formData()
      const id = formData.get("id") as string
      const banner_th_file = formData.get("banner_th")
      const banner_en_file = formData.get("banner_en")
      const title_th = formData.get("title_th") as string
      const title_en = formData.get("title_en") as string
      const particulars_th = formData.get("particulars_th") as string
      const particulars_en = formData.get("particulars_en") as string
      const start_period = formData.get("start_period") as string
      const end_period = formData.get("end_period") as string
      let banner_th_bytes = null
      let banner_en_bytes = null
      let banner_th_upload = null
      let banner_en_upload = null
      const start_period_format = start_period ? new Date(start_period) : start_period
      const end_period_format = end_period ? new Date(end_period) : end_period
      if((<File>formData.get("banner_th")).name){
        banner_th_bytes = await (<File>banner_th_file).arrayBuffer()
        const banner_th_buffer = Buffer.from(banner_th_bytes)
        banner_th_upload = await uploadFileToS3BannerTH(banner_th_buffer)
      }
      if((<File>formData.get("banner_en")).name){
        banner_en_bytes = await (<File>banner_en_file).arrayBuffer()
        const banner_en_buffer = Buffer.from(banner_en_bytes)
        banner_en_upload = await uploadFileToS3BannerEN(banner_en_buffer)
      }
      let updateData = null
      if(banner_th_bytes && banner_en_bytes){
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
      }else{
        if(banner_th_bytes){
          const banner = await prisma.corporate_activity.findUnique({
            select: {
              banner_th: true,
            },
            where: {
              id: id,
            },
          });
          if (banner) {
            if (banner?.banner_th) {
              await deleteFileFromS3BannerTH(banner.banner_th.split("/").pop());
            }
          }
        }
        if(banner_en_bytes){
          const banner = await prisma.corporate_activity.findUnique({
            select: {
              banner_en: true,
            },
            where: {
              id: id,
            },
          });
          if (banner) {
            if (banner?.banner_en) {
              await deleteFileFromS3BannerEN(banner.banner_en.split("/").pop());
            }
          }
        }
      }
      if(banner_th_upload && banner_en_upload){
        updateData = await prisma.corporate_activity.update({
          data: {
            banner_th: banner_th_upload,
            banner_en: banner_en_upload,
            title_th: title_th,
            title_en: title_en,
            particulars_th,
            particulars_en,
            start_period: start_period_format,
            end_period: end_period_format
          },
          where: {
            id,
          }
        })
      }else{
        if(banner_th_upload){
          updateData = await prisma.corporate_activity.update({
            data: {
              banner_th: banner_th_upload,
              title_th: title_th,
              title_en: title_en,
              particulars_th,
              particulars_en,
              start_period: start_period_format,
              end_period: end_period_format
            },
            where: {
              id,
            }
          })
        }
        if(banner_en_upload){
          updateData = await prisma.corporate_activity.update({
            data: {
              banner_en: banner_en_upload,
              title_th: title_th,
              title_en: title_en,
              particulars_th,
              particulars_en,
              start_period: start_period_format,
              end_period: end_period_format
            },
            where: {
              id,
            }
          })
        }
        if(!banner_th_upload && !banner_en_upload){
          updateData = await prisma.corporate_activity.update({
            data: {
              title_th: title_th,
              title_en: title_en,
              particulars_th,
              particulars_en,
              start_period: start_period_format,
              end_period: end_period_format
            },
            where: {
              id,
            }
          })
        }
      }

      return NextResponse.json({ message: "PUT Success", data: updateData }, { status: 200 });
    }catch(error: unknown){
      console.log(error)
      return NextResponse.json({ message: "PUT Unsuccess", data: error }, { status: 500 });
    }
  }

  export const dynamic = "force-dynamic";