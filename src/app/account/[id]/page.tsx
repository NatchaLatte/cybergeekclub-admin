"use client";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
  prefix_th,
  prefix_en,
  faculty_th,
  faculty_en,
  major_th,
  major_en,
  code,
} from "@/utils/custom-type";

interface RawData {
  id: string;
  email: string;
  role: string;
  point: string;
  banned: string;
  remaining_time: string;
  birthdate: string;
  code: string;
  profile_image: string;
  display_name: string;
  student_id: string;
  nickname_en: string;
  prefix_en: string;
  first_name_en: string;
  middle_name_en: string;
  last_name_en: string;
  faculty_en: string;
  major_en: string;
  nickname_th: string;
  prefix_th: string;
  first_name_th: string;
  middle_name_th: string;
  last_name_th: string;
  faculty_th: string;
  major_th: string;
}

export default function EditAccount(): JSX.Element {
  const { status }: any = useSession();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<any>();
  const [rawData, setRawData] = useState<RawData>({
    id: "",
    email: "",
    role: "",
    point: "",
    banned: "",
    remaining_time: "",
    birthdate: "",
    code: "",
    profile_image: "",
    display_name: "",
    student_id: "",
    nickname_en: "",
    prefix_en: "",
    first_name_en: "",
    middle_name_en: "",
    last_name_en: "",
    faculty_en: "",
    major_en: "",
    nickname_th: "",
    prefix_th: "",
    first_name_th: "",
    middle_name_th: "",
    last_name_th: "",
    faculty_th: "",
    major_th: ""
  });
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const getData = async () => {
    try {
      const response = await axios.get(`/api/account/${params.id}`);
      console.log(response.data.data);
      if (response.data) {
        setRawData(response.data.data);
      }
      Toast.fire({
        title: `${response.data.message}`,
        icon: "success",
      });
    } catch (error: any) {
      console.error(error);
      Toast.fire({
        title: `${error.code}`,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      getData();
    }
  }, [status, router]);

  const imageChange = (e: any) => {
    console.log(e.target.file)
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return status === "authenticated" ? (
    <main className="flex flex-col justify-center items-center h-screen">
      <Image
          onDrag={(event) => event.preventDefault()}
          onDragStart={(event) => event.preventDefault()}
          onMouseDown={(event) => event.preventDefault()}
          onContextMenu={(event) => event.preventDefault()}
          src={URL.createObjectURL(new Blob([selectedImage]))}
          alt="Image Profile"
          className="size-96"
          width={258}
          height={258}
        />
      <form action="" className="flex flex-col md:flex-row gap-2">
        <div className="flex flex-col">
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{"Profile Image"}</span>
              </div>
              <input
                accept="image/*"
                type="file"
                className="file-input file-input-primary file-input-bordered w-full"
                onChange={imageChange}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{"Student ID"}</span>
              </div>
              <input
                value={rawData.student_id}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Prefix (TH)`}</span>
              </div>
              <select className="select select-primary select-bordered">
                {prefix_th.map((value, index) => {
                  return (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Prefix (EN)`}</span>
              </div>
              <select className="select select-primary select-bordered">
                {prefix_en.map((value, index) => {
                  return (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`First Name (TH)`}</span>
              </div>
              <input
                value={rawData.first_name_th}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`First Name (EN)`}</span>
              </div>
              <input
                value={rawData.first_name_en}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Middle Name (TH)`}</span>
              </div>
              <input
                value={rawData.middle_name_th}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Middle Name (EN)`}</span>
              </div>
              <input
                value={rawData.middle_name_en}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Last Name (TH)`}</span>
              </div>
              <input
                value={rawData.last_name_th}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Last Name (EN)`}</span>
              </div>
              <input
                value={rawData.last_name_en}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Nickname (TH)`}</span>
              </div>
              <input
                value={rawData.nickname_th}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Nickname (EN)`}</span>
              </div>
              <input
                value={rawData.nickname_en}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{"Phone Number"}</span>
              </div>
              <input
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{"Point"}</span>
              </div>
              <input
                value={rawData.point}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Faculty (TH)`}</span>
              </div>
              <select className="select select-primary select-bordered">
                {faculty_th.map((value, index) => {
                  return (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Faculty (EN)`}</span>
              </div>
              <select className="select select-primary select-bordered">
                {faculty_en.map((value, index) => {
                  return (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Major (TH)`}</span>
              </div>
              <select className="select select-primary select-bordered">
                {major_th.map((value, index) => {
                  return (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{`Major (EN)`}</span>
              </div>
              <select className="select select-primary select-bordered">
                {major_en.map((value, index) => {
                  return (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{"Code"}</span>
              </div>
              <select className="select select-primary select-bordered">
                {code.map((value, index) => {
                  return (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{"Display Name"}</span>
              </div>
              <input
                value={rawData.display_name}
                type="text"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{"Banned"}</span>
              </div>
              <select className="select select-primary select-bordered">
                <option value={0}>{"FALSE"}</option>
                <option value={1}>{"TRUE"}</option>
              </select>
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{"Role"}</span>
              </div>
              <select className="select select-primary select-bordered">
                <option value={"MEMBER"}>{"MEMBER"}</option>
                <option value={"CERTIFIED"}>{"CERTIFIED"}</option>
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{"Birthdate"}</span>
              </div>
              <input
                type="date"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{"Remaining time"}</span>
              </div>
              <input
                type="datetime-local"
                placeholder=""
                className="input input-primary input-bordered w-full"
              />
            </label>
          </div>
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
