import { PrismaClient, account } from "@prisma/client";
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

async function deleteFileFromS3Profile(file_id: string | undefined) {
  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: `asset/image/profile/${file_id}`,
  };
  await s3Client.send(new DeleteObjectCommand(params));
}

export async function POST(request: NextRequest) {
  try {
    const { id }: account = await request.json();
    const profile = await prisma.account.findUnique({
      select: {
        profile_image: true,
      },
      where: {
        id: id,
      },
    });
    if (profile) {
      if (profile?.profile_image) {
        await deleteFileFromS3Profile(profile.profile_image.split("/").pop());
      }
    }
    const deleteData = await prisma.account.delete({
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
