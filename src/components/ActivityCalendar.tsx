"use client";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSyncAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";

export default function ActivityCalendar(): JSX.Element {
  const { status }: any = useSession();
  const router = useRouter();
  const [dataTable, setDataTable] = useState([]);
  const [dataTableSearch, setDataTableSearch] = useState([]);
  const [display, setDisplay] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const getData = async () => {
    try {
      const response = await axios.get("/api/activity-calendar");
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
    setSearch(event.target.value);
    const dataTableSearchFilter = dataTable.filter((value: any) => {
      const id = value.id ? value.id.toLowerCase() : "";
      const particularsTH = value.particulars_th
        ? value.particulars_th.toLowerCase()
        : "";
      const particularsEN = value.particulars_en
        ? value.particulars_en.toLowerCase()
        : "";
      return (
        id.includes(event.target.value.toLowerCase()) ||
        particularsTH.includes(event.target.value.toLowerCase()) ||
        particularsEN.includes(event.target.value.toLowerCase())
      );
    });
    if (event.target.value.length > 0) {
      setDataTableSearch(dataTableSearchFilter);
    } else {
      setDataTableSearch(dataTable);
    }
  };

  const handleSync = async () => {
    try {
      getData();
      await Toast.fire({
        title: "Sync success.",
        icon: "success",
      });
    } catch (error: unknown) {
      console.error(error);
      await Toast.fire({
        title: "Sync faild.",
        icon: "error",
      });
    }
  };

  const handleCreate = async () => {
    try {
      router.push("/activity-calendar/create");
    } catch (error: unknown) {
      console.error(error);
      await Toast.fire({
        title: "Create faild.",
        icon: "error",
      });
    }
  };

  const handleEdit = async (id: string) => {
    try {
      router.push(`/activity-calendar/${id}`);
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
          await axios.post("/api/activity-calendar/delete", {
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
        <input
          onChange={handleSearch}
          value={search}
          placeholder="ID or Particulars"
          className="input input-primary w-full md:w-fit md:flex-1"
          type="search"
        />
        <button
          onClick={handleCreate}
          className="btn btn-square w-full md:w-fit md:flex-1"
        >
          Create
        </button>
        <button
          onClick={handleSync}
          className="btn btn-info w-full md:btn-wide"
        >
          <FaSyncAlt /> Sync
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra table-auto">
          {/* head */}
          <thead className="bg-primary text-white text-center">
            <tr>
              <th>Action</th>
              <th>ID</th>
              <th>{`Particulars (TH)`}</th>
              <th>{`Particulars (EN)`}</th>
              <th>Start Period</th>
              <th>End Period</th>
            </tr>
          </thead>
          <tbody>
            {dataTableSearch.length > 0 &&
              dataTableSearch.map((data: any, index) => {
                return (
                  <tr key={data.id}>
                    {display === true ? (
                      <td className="text-center">
                        <span className="loading loading-dots"></span>
                      </td>
                    ) : (
                      <td className="flex flex-col md:flex-row gap-3 justify-center items-center">
                        <button
                          onClick={() => handleEdit(data.id)}
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
                    <td className="text-center">{data.id}</td>
                    <td className="text-center">{data.particulars_th}</td>
                    <td className="text-center">{data.particulars_en}</td>
                    <td className="text-center">
                      {data.start_period
                        ? moment.tz(data.start_period, "Asia/Bangkok").locale("th").format("L")
                        : "Not specified"}
                    </td>
                    <td className="text-center">
                      {data.end_period
                        ? moment.tz(data.end_period, "Asia/Bangkok").locale("th").format("L")
                        : "Not specified"}
                    </td>
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
