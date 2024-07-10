"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";

interface RawData {
  category: string;
  display_name: string;
  uri: string;
}


export default function CreateContact(): JSX.Element {
  const { status }: any = useSession();
  const router = useRouter();
  const [rawData, setRawData] = useState<RawData>({
    category: "",
    display_name: "",
    uri: "",
  });

  const [display, setDisplay] = useState<boolean>(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleBack = () => {
    router.push("/contact");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!display){
        Swal.fire({
            title: "Do you want to the create?",
            confirmButtonText: "Confirm",
            confirmButtonColor: "#00a96f",
            showCancelButton: true,
          }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              try {
                setDisplay(true);
                await axios.post("/api/contact/create", rawData);
                setRawData({
                  category: "",
                  display_name: "",
                  uri: "",
                })
                await Toast.fire({
                  title: "Create success.",
                  icon: "success",
                });
              } catch (error: unknown) {
                console.error(error);
                await Toast.fire({
                  title: "Create faild.",
                  icon: "error",
                });
              } finally {
                setDisplay(false);
              }
            }
          });
    }
  };

  const setCategory = (category: any) => {
    setRawData({ ...rawData, category: category.target.value });
  };

  const setDisplayName = (display_name: any) => {
    setRawData({ ...rawData, display_name: display_name.target.value });
  };

  const setURI = (uri: any) => {
    setRawData({ ...rawData, uri: uri.target.value });
  };

  return status === "authenticated" ? (
    <main className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-3xl">Create Contact</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Display Name</span>
          </div>
          <input
            value={rawData.display_name}
            onChange={setDisplayName}
            type="text"
            className="input input-primary input-bordered w-full"
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">URI</span>
          </div>
          <input
            value={rawData.uri}
            onChange={setURI}
            type="url"
            className="input input-primary input-bordered w-full"
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Category</span>
          </div>
          <select
            value={rawData.category}
            onChange={setCategory}
            className="select select-primary select-bordered"
          >
            <option value="">ไม่เลือกหมวดหมู่</option>
            <option value="FACEBOOK">FACEBOOK</option>
            <option value="INSTAGRAM">INSTAGRAM</option>
            <option value="YOUTUBE">YOUTUBE</option>
            <option value="DISCORD">DISCORD</option>
          </select>
        </label>
        <div className="flex gap-3">
        <button type="submit" className="btn btn-primary btn-wide mt-3">
          {display === true ? (
            <span className="loading loading-dots"></span>
          ) : (
            "Create"
          )}
        </button>
        <button
          type="button"
          className="btn btn-neutral btn-wide mt-3"
          onClick={handleBack}
        >
          Back
        </button>
        </div>
      </form>
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
