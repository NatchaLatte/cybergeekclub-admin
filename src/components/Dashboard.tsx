"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DashboardData } from "@/utils/custom-type";
import axios from "axios";

export default function Dashboard(): JSX.Element {
  const { status }: any = useSession();
  const [dataTable, setDataTable] = useState<DashboardData>();

  const getData = async () => {
    try {
      const response = await axios.get("/api/dashboard");
      setDataTable(response.data.data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return status === "authenticated" ? (
    <div className="flex flex-col gap-5 justify-center items-center h-screen">
      <div className="flex flex-col lg:flex-row text-base-100 bg-primary w-[90%] lg:h-32 rounded-xl shadow">
        <div className="flex flex-row justify-center items-center size-full border-neutral border-b-2 lg:border-b-0 lg:border-r-2 p-3">
          <div className="flex flex-col justify-center items-center flex-1">
            <div className="text-2xl text-pretty text-center">
              Administrator Total
            </div>
            <div className="text-4xl">
              {dataTable ? (
                dataTable.accountAdminAmount
              ) : (
                <span className="loading loading-dots loading-lg"></span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center size-full border-neutral border-b-2 lg:border-b-0 lg:border-r-2 p-3">
          <div className="flex flex-col justify-center items-center flex-1">
            <div className="text-2xl text-pretty text-center">Member Total</div>
            <div className="text-4xl">
              {dataTable ? (
                dataTable.accountMemberAmount
              ) : (
                <span className="loading loading-dots loading-lg"></span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center size-full p-3">
          <div className="flex flex-col justify-center items-center flex-1">
            <div className="text-2xl text-pretty text-center">
              Certified Total
            </div>
            <div className="text-4xl">
              {dataTable ? (
                dataTable.accountCertifiedAmount
              ) : (
                <span className="loading loading-dots loading-lg"></span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row text-base-100 bg-primary w-[90%] lg:h-32 rounded-xl shadow">
        <div className="flex flex-row justify-center items-center size-full border-neutral border-b-2 lg:border-b-0 lg:border-r-2 p-3">
          <div className="flex flex-col justify-center items-center flex-1">
            <div className="text-2xl text-pretty text-center">Budget</div>
            <div className="text-4xl">
              {dataTable ? (
                dataTable.budgetAmount
              ) : (
                <span className="loading loading-dots loading-lg"></span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center size-full border-neutral border-b-2 lg:border-b-0 lg:border-r-2 p-3">
          <div className="flex flex-col justify-center items-center flex-1">
            <div className="text-2xl text-pretty text-center">Expenditure</div>
            <div className="text-4xl">
              {dataTable ? (
                dataTable.expenditureAmount
              ) : (
                <span className="loading loading-dots loading-lg"></span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center size-full p-3">
          <div className="flex flex-col justify-center items-center flex-1">
            <div className="text-2xl text-pretty text-center">Balance</div>
            <div className="text-4xl">
              {dataTable ? (
                dataTable.balanceAmount
              ) : (
                <span className="loading loading-dots loading-lg"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <main className="flex space-x-2 justify-center items-center bg-base-100 h-screen">
      <span className="sr-only">Loading...</span>
      <div className="h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-8 w-8 bg-primary rounded-full animate-bounce"></div>
    </main>
  );
}
