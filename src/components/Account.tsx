"use client";
import { useSession } from "next-auth/react";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSyncAlt } from "react-icons/fa";
import moment from "moment-timezone";
import Image from "next/image";

export default function Account(): JSX.Element {
  const { status }: any = useSession();
  const router = useRouter();
  const [dataTable, setDataTable] = useState([]);
  const [dataTableSearch, setDataTableSearch] = useState([]);
  const [display, setDisplay] = useState<boolean>(false);
  const [displaySendMail, setDisplaySendMail] = useState<boolean>(false);
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
      const response = await axios.get("/api/account");
      setDataTable(response.data.data);
      setDataTableSearch(response.data.data);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    const dataTableSearchFilter = dataTable.filter((value: any) => {
      const accountEmail = value.email ? value.email.toLowerCase() : ""
      return accountEmail.includes(event.target.value.toLowerCase())
    })
    if (event.target.value.length > 0) {
      setDataTableSearch(dataTableSearchFilter)
    } else {
      setDataTableSearch(dataTable)
    }
  }

  const handleSync = async () => {
    try {
      getData();
      await Toast.fire({
        title: "Sync success.",
        icon: "success",
      });
    } catch (error: unknown) {
      console.error(error)
      await Toast.fire({
        title: "Sync faild.",
        icon: "error",
      });
    }
  }

  const handleEdit = async (id: string) => {
    try {
      // router.push(`/account/${id}`);
      await Toast.fire({
        title: "This feature is not supported yet.",
        icon: "warning",
      });
    } catch (error: unknown) {
      console.error(error);
      await Toast.fire({
        title: "Edit faild.",
        icon: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Do you want to the delete?",
      confirmButtonText: "Confirm",
      confirmButtonColor: "#00a96f",
      showCancelButton: true,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          setDisplay(true);
          await axios.post("/api/account/delete", {
            id: id,
          });
          getData();
          await Toast.fire({
            title: "Delete success.",
            icon: "success",
          });
        } catch (error: unknown) {
          console.error(error);
          getData();
          await Toast.fire({
            title: "Delete faild.",
            icon: "error",
          });
        } finally {
          setDisplay(false);
        }
      }
    });
  };

  return status === "authenticated" ? (
    <main>
      <div className="flex flex-col md:flex-row gap-3 m-5">
        <input onChange={handleSearch} value={search} placeholder="Account" className="input input-primary w-full md:w-fit md:flex-1" type="search" />
        <button onClick={handleSync} className="btn btn-info w-full md:btn-wide"><FaSyncAlt /> Sync</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra table-auto">
          {/* head */}
          <thead className="bg-primary text-white text-center">
            <tr>
              <th>Action</th>
              <th>Email</th>
              <th>Role</th>
              <th>Point</th>
              <th>Banned</th>
              <th>Phone Number</th>
              <th>Remaining Time</th>
              <th>Birthdate</th>
              <th>Code</th>
              <th>Profile Image</th>
              <th>Display Name</th>
              <th>Student ID</th>
              <th>Nickname (TH)</th>
              <th>Prefix (TH)</th>
              <th>First Name (TH)</th>
              <th>Middle Name (TH)</th>
              <th>Last Name (TH)</th>
              <th>Faculty (TH)</th>
              <th>Major (TH)</th>
              <th>Nickname (EN)</th>
              <th>Prefix (EN)</th>
              <th>First Name (EN)</th>
              <th>Middle Name (EN)</th>
              <th>Last Name (EN)</th>
              <th>Faculty (EN)</th>
              <th>Major (EN)</th>
            </tr>
          </thead>
          <tbody>
            {/* body */}
            {dataTableSearch.length > 0 &&
              dataTableSearch.map((data: any) => {
                return (
                  <tr key={data.id}>
                    {display === true ? (
                      <td className="text-center">
                        <span className="loading loading-dots"></span>
                      </td>
                    ) : (
                      <td className="flex flex-col md:flex-row gap-3 justify-center items-center h-96">
                        <button
                          onClick={() => handleEdit(data.id)}
                          disabled={false}
                          className="btn btn-warning btn-xs w-full md:w-fit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(data.id)}
                          className="btn btn-error btn-xs w-full md:w-fit"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                    <td className="text-center">{data.email}</td>
                    <td className="text-center">{data.role}</td>
                    <td className="text-center">{data.point}</td>
                    <td className="text-center">{data.banned}</td>
                    <td className="text-center">{data.phone_number}</td>
                    <td className="text-center">{moment.tz(data.remaining_time, "Asia/Bangkok").locale("th").format("L")}</td>
                    <td className="text-center">{moment.tz(data.birthdate, "Asia/Bangkok").locale("th").format("L")}</td>
                    <td className="text-center">{data.code}</td>
                    <td className="text-center">
                    {data.profile_image ? (
                        <Image
                          onDrag={(event) => event.preventDefault()}
                          onDragStart={(event) => event.preventDefault()}
                          onMouseDown={(event) => event.preventDefault()}
                          onContextMenu={(event) => event.preventDefault()}
                          src={data.profile_image}
                          alt={data.display_name}
                          className="hidden md:block w-full max-w-52"
                          width={128}
                          height={128}
                        />
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="text-center">{data.display_name}</td>
                    <td className="text-center">{data.student_id}</td>
                    <td className="text-center">{data.nickname_th}</td>
                    <td className="text-center">{data.prefix_th}</td>
                    <td className="text-center">{data.first_name_th}</td>
                    <td className="text-center">{data.middle_name_th}</td>
                    <td className="text-center">{data.last_name_th}</td>
                    <td className="text-center">{data.faculty_th}</td>
                    <td className="text-center">{data.major_th}</td>
                    <td className="text-center">{data.nickname_en}</td>
                    <td className="text-center">{data.prefix_en}</td>
                    <td className="text-center">{data.first_name_en}</td>
                    <td className="text-center">{data.middle_name_en}</td>
                    <td className="text-center">{data.last_name_en}</td>
                    <td className="text-center">{data.faculty_en}</td>
                    <td className="text-center">{data.major_en}</td>
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
