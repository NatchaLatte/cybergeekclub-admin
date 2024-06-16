import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma: PrismaClient = new PrismaClient();

interface DashboardData {
    accountAdminAmount: number;
    accountMemberAmount: number;
    accountCertifiedAmount: number;
    budgetAmount: number;
    expenditureAmount: number;
    balanceAmount: number;
}

export async function GET() {
    try {
        const accountAdminAmount = await prisma.account_admin.count()
        const accountMemberAmount = await prisma.account.count({
            where: {
                role: "MEMBER"
            }
        })
        const accountCertifiedAmount = await prisma.account.count({
            where: {
                role: "CERTIFIED"
            }
        })
        const budget_amount = await prisma.budget.aggregate({
            _sum: {
                money: true
            }
        })
        const expenditure_amount = await prisma.expenditure.aggregate({
            _sum: {
                money: true
            }
        })
        const budgetAmount = budget_amount._sum.money ?? 0;
        const expenditureAmount = expenditure_amount._sum.money ?? 0;
        const balanceAmount = budgetAmount - expenditureAmount
        const dashboardData: DashboardData = {
            accountAdminAmount: accountAdminAmount,
            accountMemberAmount: accountMemberAmount,
            accountCertifiedAmount: accountCertifiedAmount,
            budgetAmount: budgetAmount,
            expenditureAmount: expenditureAmount,
            balanceAmount: balanceAmount
        }
        return NextResponse.json({ message: "Get data success.", data: dashboardData }, { status: 200 })
    } catch (error: unknown) {
        return NextResponse.json({ error: "Get data failed.", data: error }, { status: 500 })
    }
}