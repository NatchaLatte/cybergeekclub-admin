"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";

interface RawData {
  particulars_th: string;
  particulars_en: string;
  money: number;
  time_series: string;
}

export default function CreateExpenditure(): JSX.Element {
  const { status }: any = useSession();
  const router = useRouter();
  const [rawData, setRawData] = useState<RawData>({
    particulars_th: "",
    particulars_en: "",
    money: 0,
    time_series: "",
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
    router.push("/expenditure");
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
            await axios.post("/api/expenditure/create", rawData);
            setRawData({
              particulars_th: "",
              particulars_en: "",
              money: 0,
              time_series: "",
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

  const setParticularsTH = (particulars_th: any) => {
    setRawData({ ...rawData, particulars_th: particulars_th.target.value });
  };

  const setParticularsEN = (particulars_en: any) => {
    setRawData({ ...rawData, particulars_en: particulars_en.target.value });
  };

  const setMoney = (money: any) => {
    setRawData({ ...rawData, money: Number.parseFloat(money.target.value) });
  };

  const setTimeSeries = (time_series: any) => {
    setRawData({ ...rawData, time_series: time_series.target.value });
  };

  return status === "authenticated" ? (
    <main className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-3xl">Create Expenditure</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex gap-3">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{`Particulars (TH)`}</span>
            </div>
            <input
              value={rawData.particulars_th}
              onChange={setParticularsTH}
              type="text"
              className="input input-primary input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">{`Particulars (EN)`}</span>
            </div>
            <input
              value={rawData.particulars_en}
              onChange={setParticularsEN}
              type="text"
              className="input input-primary input-bordered w-full max-w-xs"
            />
          </label>
        </div>
        <div className="flex gap-3">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Money</span>
            </div>
            <input
              value={rawData.money}
              onChange={setMoney}
              type="number"
              className="input input-primary input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Time Series</span>
            </div>
            <input
              value={moment(rawData.time_series).format().substring(0, 16)}
              onChange={setTimeSeries}
              type="datetime-local"
              className="input input-primary input-bordered w-full max-w-xs"
            />
          </label>
        </div>
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
