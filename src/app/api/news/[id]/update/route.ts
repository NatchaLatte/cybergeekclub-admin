import { PrismaClient, news } from "@prisma/client";
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

async function deleteFileFromS3BannerTH(file_id: string | undefined) {
  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: `asset/image/banner_news_th/${file_id}`,
  };
  await s3Client.send(new DeleteObjectCommand(params));
}

async function deleteFileFromS3BannerEN(file_id: string | undefined) {
  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: `asset/image/banner_news_en/${file_id}`,
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
      const time_series = formData.get("time_series") as string
      const email = formData.get("email") as string
      let banner_th_bytes = null
      let banner_en_bytes = null
      let banner_th_upload = null
      let banner_en_upload = null
      const accountAdmin = await prisma.account_admin.findUnique({
        select: { id: true },
        where: { email: email },
      });
      if(!accountAdmin){
        throw "Account not found!"
      }
      const time_series_format = time_series ? new Date(time_series) : time_series
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
        const banner = await prisma.news.findUnique({
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
          const banner = await prisma.news.findUnique({
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
          const banner = await prisma.news.findUnique({
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
        updateData = await prisma.news.update({
          data: {
            banner_th: banner_th_upload,
            banner_en: banner_en_upload,
            title_th: title_th,
            title_en: title_en,
            particulars_th,
            particulars_en,
            time_series: time_series_format,
            account_admin_id: accountAdmin.id
          },
          where: {
            id,
          }
        })
      }else{
        if(banner_th_upload){
          updateData = await prisma.news.update({
            data: {
              banner_th: banner_th_upload,
              title_th: title_th,
              title_en: title_en,
              particulars_th,
              particulars_en,
              time_series: time_series_format,
              account_admin_id: accountAdmin.id
            },
            where: {
              id,
            }
          })
        }
        if(banner_en_upload){
          updateData = await prisma.news.update({
            data: {
              banner_en: banner_en_upload,
              title_th: title_th,
              title_en: title_en,
              particulars_th,
              particulars_en,
              time_series: time_series_format,
              account_admin_id: accountAdmin.id
            },
            where: {
              id,
            }
          })
        }
        if(!banner_th_upload && !banner_en_upload){
          updateData = await prisma.news.update({
            data: {
              title_th: title_th,
              title_en: title_en,
              particulars_th,
              particulars_en,
              time_series: time_series_format,
              account_admin_id: accountAdmin.id
            },
            where: {
              id,
            }
          })
        }
      }

      return NextResponse.json({ message: "PUT Success", data: "updateData" }, { status: 200 });
    }catch(error: unknown){
      console.log(error)
      return NextResponse.json({ message: "PUT Unsuccess", data: error }, { status: 500 });
    }
  }

  export const dynamic = "force-dynamic";