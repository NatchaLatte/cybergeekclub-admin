"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { AiFillDashboard } from "react-icons/ai";
import { RiLogoutBoxFill } from "react-icons/ri";
import {
  MdSupervisorAccount,
  MdCorporateFare,
  MdFamilyRestroom,
} from "react-icons/md";
import { IoDocumentText, IoNewspaper } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import Link from "next/link";
import PageContent from "@/components/DocumentLog";

export default function DocumentLog(): JSX.Element {
  const { data, status }: any = useSession();
  const router = useRouter();

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

  const handleSignOut = () => {
    signOut({ redirect: false }).then(() => {
      router.push("/");
      Toast.fire({
        title: "Sign out success.",
        icon: "success",
      });
    });
  };

  return status === "authenticated" ? (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navigationbar here */}
        <div className="navbar bg-base-100 lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-square btn-ghost drawer-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="text-xl">Document log</div>
        </div>
        {/* Page content here */}
        <PageContent />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="gap-3 menu text-xl p-4 w-80 min-h-full bg-base-100">
          {/* Sidebar content here */}
          <h1 className="text-xl text-center bg-primary rounded py-3 my-3 text-white">
            Hello{" "}
            {data.user?.display_name
              ? `${data.user?.display_name}!`
              : "Loading..."}
          </h1>
          <li>
            <Link
              href={"/dashboard"}
            >
              <AiFillDashboard /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              href={"/account"}
            >
              <MdSupervisorAccount /> Account
            </Link>
          </li>
          <li>
            <Link
              href={"/document-log"}
              className="active"
            >
              <IoDocumentText /> Document log
            </Link>
          </li>
          <li>
            <Link
              href={"/news"}
            >
              <IoNewspaper /> News
            </Link>
          </li>
          <li>
            <Link
              href={"/corporate-activity"}
            >
              <MdCorporateFare /> Corporate activity
            </Link>
          </li>
          <li>
            <Link
              href={"/activity-calendar"}
            >
              <FaCalendarAlt /> Activity calendar
            </Link>
          </li>
          <li>
            <Link
              href={"/budget"}
            >
              <GiReceiveMoney /> Budget
            </Link>
          </li>
          <li>
            <Link
              href={"/expenditure"}
            >
              <GiPayMoney /> Expenditure
            </Link>
          </li>
          <li>
            <Link
              href={"/personnel"}
            >
              <MdFamilyRestroom /> Personnel
            </Link>
          </li>
          <li>
            <Link
              href={"/contact"}
            >
              <BsFillTelephoneFill /> Contact
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={handleSignOut}
            >
              <RiLogoutBoxFill /> Sign out
            </button>
          </li>
        </ul>
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
