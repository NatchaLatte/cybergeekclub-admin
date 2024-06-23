"use client";
import { FormEvent, useEffect, useState, ReactEventHandler, EventHandler, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MdOutlineFileUpload } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment-timezone";
import Image from "next/image";
import { motion } from "framer-motion";

interface RawData {
  banner_th: string;
  banner_en: string;
  title_th: string;
  title_en: string;
  particulars_th: string;
  particulars_en: string;
  start_period: string;
  end_period: string;
}

export default function CreateCorporateActivity(): JSX.Element {
  const { status }: any = useSession();
  const router = useRouter();
  const [switchLang, setSwitchLang] = useState<string>("TH");
  const [rawData, setRawData] = useState<RawData>({
    banner_th: "",
    banner_en: "",
    title_th: "",
    title_en: "",
    particulars_th: "",
    particulars_en: "",
    start_period: "",
    end_period: "",
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
    router.push("/corporate-activity");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!display) {
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
            await axios.post("/api/corporate-activity/create", rawData, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });
            setRawData({
              banner_th: "",
              banner_en: "",
              title_th: "",
              title_en: "",
              particulars_th: "",
              particulars_en: "",
              start_period: "",
              end_period: "",
            });
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

  const setBannerTH = (banner_th: any) => {
    if (banner_th.target.files && banner_th.target.files.length > 0) {
      setRawData({ ...rawData, banner_th: banner_th.target.files[0] });
    }
  };
  const setBannerEN = (banner_en: any) => {
    if (banner_en.target.files && banner_en.target.files.length > 0) {
      setRawData({ ...rawData, banner_en: banner_en.target.files[0] });
    }
  };

  const setTitleTH = (title_th: any) => {
    setRawData({ ...rawData, title_th: title_th.target.value });
  };

  const setTitleEN = (title_en: any) => {
    setRawData({ ...rawData, title_en: title_en.target.value });
  };

  const setParticularsTH = (particulars_th: any) => {
    setRawData({ ...rawData, particulars_th: particulars_th.target.value });
  };

  const setParticularsEN = (particulars_en: any) => {
    setRawData({ ...rawData, particulars_en: particulars_en.target.value });
  };

  const setStartPeriod = (start_period: any) => {
    setRawData({ ...rawData, start_period: start_period.target.value });
  };

  const setEndPeriod = (end_period: any) => {
    setRawData({ ...rawData, end_period: end_period.target.value });
  };

  const onImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/512x512"
  }

  return status === "authenticated" ? (
    <main className="flex flex-row h-screen justify-center items-center gap-5">
      <div className="flex flex-col">
        <h1 className="text-3xl my-5 text-center">Create Corporate Activity</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-row justify-center items-center gap-3"
        >
          <div className="flex flex-col">
            <div className="flex gap-3">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">{`Banner (TH)`}</span>
                </div>
                <input
                  onChange={setBannerTH}
                  type="file"
                  className="file-input file-input-primary input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">{`Banner (EN)`}</span>
                </div>
                <input
                  onChange={setBannerEN}
                  type="file"
                  className="file-input file-input-primary input-bordered w-full max-w-xs"
                />
              </label>
            </div>
            <div className="flex gap-3">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">{`Title (TH)`}</span>
                </div>
                <input
                  value={rawData.title_th}
                  onChange={setTitleTH}
                  type="text"
                  className="input input-primary input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">{`Title (EN)`}</span>
                </div>
                <input
                  value={rawData.title_en}
                  onChange={setTitleEN}
                  type="text"
                  className="input input-primary input-bordered w-full max-w-xs"
                />
              </label>
            </div>
            <div className="flex gap-3">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">{`Particulars (TH)`}</span>
                </div>
                <textarea
                  value={rawData.particulars_th}
                  onChange={setParticularsTH}
                  className="input input-primary input-bordered w-full max-w-xs"
                ></textarea>
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">{`Particulars (EN)`}</span>
                </div>
                <textarea
                  value={rawData.particulars_en}
                  onChange={setParticularsEN}
                  className="input input-primary input-bordered w-full max-w-xs"
                ></textarea>
              </label>
            </div>
            <div className="flex gap-3">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Start Period</span>
                </div>
                <input
                  value={moment(rawData.start_period).format().substring(0, 16)}
                  onChange={setStartPeriod}
                  type="datetime-local"
                  className="input input-primary input-bordered w-full max-w-xs"
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">End Period</span>
                </div>
                <input
                  value={moment(rawData.end_period).format().substring(0, 16)}
                  onChange={setEndPeriod}
                  type="datetime-local"
                  className="input input-primary input-bordered w-full max-w-xs"
                />
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1 mt-3">
                {display === true ? (
                  <span className="loading loading-dots"></span>
                ) : (
                  "Create"
                )}
              </button>
              <button
                type="button"
                className="btn btn-neutral flex-1 mt-3"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="flex flex-col">
        <h1 className="text-3xl my-5 text-center">Preview</h1>
        <motion.div
          className="group md:grid md:grid-cols-3 mx-2 my-2 border-solid border-white/50 border-2 rounded-2xl hover:ring-1 hover:border-green-500 hover:ring-green-500 transition-all duration-200 hover:shadow-[0_0_10px_rgba(34, 197, 94,1)] shadow-zinc-200"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <picture>
            <Image
              src={
                switchLang === "TH"
                  ? URL.createObjectURL(new Blob([rawData.banner_th]))
                  : URL.createObjectURL(new Blob([rawData.banner_en]))
              }
              onError={onImageError}
              width={512}
              height={512}
              alt={switchLang === "TH" ? rawData.title_th : rawData.title_en}
              className="rounded-l-2xl size-full"
            />
          </picture>
          <article className="mx-5 grid-rows-2 h-full col-span-2 ">
            <div className="w-full max-h-[80%]">
              <p className="break-words font-kanit text-start text-2xl py-4">
                {switchLang === "TH"
                  ? rawData.title_th
                    ? rawData.title_th
                    : "ไม่มีหัวข้อ"
                  : rawData.title_en
                  ? rawData.title_en
                  : "Untitled"}
              </p>
              <h1 className="text-green-500">รายละเอียดกิจกรรม : </h1>
              <pre className="my-2 rounded-2xl bg-base-200 overflow-auto h-64 max-h-64 break-words whitespace-pre-wrap font-kanit text-start text-neutral-300">
                {switchLang === "TH"
                  ? rawData.particulars_th
                    ? rawData.particulars_th
                    : "-"
                  : rawData.particulars_en
                  ? rawData.particulars_en
                  : "-"}
              </pre>
              <div className="bottom-0">
                <pre className="break-words whitespace-pre-wrap flex font-kanit text-start text-neutral-300">
                  <h1 className="text-green-500">เวลาเริ่มกิจกรรม : </h1>
                  {rawData.start_period
                    ? moment
                        .tz(rawData.start_period, "Asia/Bangkok")
                        .locale("th")
                        .format("L")
                    : moment.tz("Asia/Bangkok").locale("th").format("L")}
                </pre>
                <pre className="break-words whitespace-pre-wrap flex font-kanit text-start text-neutral-300">
                  <h1 className="text-green-500">เวลาสิ้นสุดกิจกรรม : </h1>
                  {rawData.end_period
                    ? moment
                        .tz(rawData.end_period, "Asia/Bangkok")
                        .locale("th")
                        .format("L")
                    : moment.tz("Asia/Bangkok").locale("th").format("L")}
                </pre>
              </div>
            </div>
            <div className="flex justify-center gap-5 h-fit">
              <button className="btn btn-success place-self-center">
                เข้าร่วมกิจกรรม
              </button>
              <button
                className="btn btn-error place-self-center"
                onClick={() => {
                  switchLang === "TH"
                    ? setSwitchLang("EN")
                    : setSwitchLang("TH");
                }}
              >
                {switchLang === "TH" ? "EN" : "TH"}
              </button>
            </div>
          </article>
        </motion.div>
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
