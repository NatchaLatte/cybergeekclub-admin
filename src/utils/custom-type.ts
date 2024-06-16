export interface Account {
    email: string;
    password: string;
}

export interface DashboardData {
    accountAdminAmount: number;
    accountMemberAmount: number;
    accountCertifiedAmount: number;
    budgetAmount: number;
    expenditureAmount: number;
    balanceAmount: number;
}