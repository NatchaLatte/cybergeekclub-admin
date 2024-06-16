import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 } from "uuid";

const prisma: PrismaClient = new PrismaClient();
const saltOrRounds: string | number = 10

export async function POST(request: Request) {
  try {
    const { email, password, display_name }: {
        email: string,
        password: string,
        display_name: string
    } = await request.json()
    const hashedPassword: string = bcrypt.hashSync(password, saltOrRounds)
    const account_admin = await prisma.account_admin.create({
        data: {
            id: v4(),
            email: email,
            password: hashedPassword,
            display_name: display_name
        }
    })
    return Response.json({ message: "Create account success.", data: account_admin }, { status: 200 });
  } catch (error: unknown) {
    return Response.json({ error: "Create account failed.", data: error }, { status: 500 });
  }
}
