"use client";
import { useSession } from "next-auth/react";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";

export default function DocumentLog(): JSX.Element {
  const { data, status }: any = useSession();
  const [dataTable, setDataTable] = useState([]);
  const [dataTableSearch, setDataTableSearch] = useState([]);
  const [display, setDisplay] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("")

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const getData = async () => {
    try {
      const response = await axios.get("/api/document-log");
      setDataTable(response.data.data);
      setDataTableSearch(response.data.data);
    } catch (error: unknown) {
      console.error(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleViewNotation = async (notation: string) => {
    Swal.fire({
      title: "Notation",
      text: notation,
      icon: "info",
    });
  };

  const handleApprove = async (id: string, account_admin_id: string | null) => {
    Swal.fire({
      title: "Do you want to save the approve?",
      confirmButtonText: "Approve",
      confirmButtonColor: "#00a96f",
      showCancelButton: true,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          setDisplay(true)
          await axios.post("/api/document-log", {
            id: id,
            email: data.user.email,
            notation: null
          });
          getData();
          await Toast.fire({
            title: "Approve success.",
            icon: "success",
          });
        } catch (error: unknown) {
          getData();
          await Toast.fire({
            title: "Approve faild.",
            icon: "error",
          });
        } finally {
          setDisplay(false)
        }
      }
    });
  };

  const handleReject = async (id: string, account_admin_id: string | null) => {
    const { value: text } = await Swal.fire({
      title: "Notation",
      input: "textarea",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      confirmButtonText: "Reject",
      confirmButtonColor: "#ff6f70",
      showCancelButton: true,
    });
    if (text) {
      try {
        setDisplay(true)
        await axios.post("/api/document-log", {
          id: id,
          email: data.user.email,
          notation: text
        });
        getData();
        await Toast.fire({
          title: "Reject success.",
          icon: "success",
        });
      } catch (error: unknown) {
        getData();
        await Toast.fire({
          title: "Reject faild.",
          icon: "error",
        });
      } finally {
        setDisplay(false)
      }
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    const dataTableSearchFilter = dataTable.filter((value: any) => {
      const accountEmail = value.account_email ? value.account_email.toLowerCase() : ""
      const accountStatus = value.status.toLowerCase()
      return accountEmail.includes(event.target.value.toLowerCase()) || accountStatus.includes(event.target.value.toLowerCase())
    })
    if(event.target.value.length > 0){
      setDataTableSearch(dataTableSearchFilter)
    }else{
      setDataTableSearch(dataTable)
    }
  }

  return status === "authenticated" ? (
    <main>
      <div className="flex flex-col md:flex-row gap-3 m-5">
        <input onChange={handleSearch} value={search} placeholder="Account or Status" className="input input-primary w-full md:w-fit md:flex-1" type="search" />
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra table-auto">
          {/* head */}
          <thead className="bg-primary text-white text-center">
            <tr>
              <th>Action</th>
              <th>Account</th>
              <th>Document</th>
              <th>Status</th>
              <th>Notation</th>
              <th>Approver or Rejecter</th>
            </tr>
          </thead>
          <tbody>
            {/* body */}
            {dataTableSearch.length > 0 &&
              dataTableSearch.map((data: any) => {
                return (
                  <tr key={data.id}>
                    {(data.status !== "PENDING") ? (
                      <td className="text-center">
                      {new Date(data.built).toLocaleString("th-TH")}
                      </td>
                    ) : (display === true) ? <td className="text-center"><span className="loading loading-dots"></span></td> : (
                      <td className="flex flex-col md:flex-row gap-3 justify-center items-center">
                      <button
                        onClick={() => {
                          handleApprove(data.id, data.account_admin_id);
                        }}
                        className="btn btn-success btn-xs w-full md:w-fit"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleReject(data.id, data.account_admin_id);
                        }}
                        className="btn btn-error btn-xs w-full md:w-fit"
                      >
                        Reject
                      </button>
                    </td>
                    )}
                    <td className="text-center">{data.account_email}</td>
                    <td className="text-center">
                      <Link
                        className="btn btn-info btn-xs"
                        href={data.document}
                        target="_blank"
                      >
                        View
                      </Link>
                    </td>
                    <td
                      className={`${
                        data.status === "APPROVE"
                          ? "text-success"
                          : data.status === "REJECT"
                          ? "text-error"
                          : "text-warning"
                      } text-center font-bold`}
                    >
                      {data.status}
                    </td>
                    {data.notation ? (
                      <td className="text-center">
                        <button
                          onClick={() => {
                            handleViewNotation(data.notation);
                          }}
                          className="btn btn-primary btn-xs"
                        >
                          View
                        </button>
                      </td>
                    ) : (
                      <td></td>
                    )}
                    <td className="text-center">{data.account_admin_email}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </main>
  ) : (
    <main className="flex space-x-2 justify-center items-center bg-base-100 h-screen">
      <span className="sr-only">Loading...</span>
      <div className="h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-8 w-8 bg-primary rounded-full animate-bounce"></div>
    </main>
  );
}
