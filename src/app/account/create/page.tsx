"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function CreateAccount(): JSX.Element {
    const { status }: any = useSession();
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

    return status === "authenticated" ? (
      <main></main>
    ) : (
      <main className="flex space-x-2 justify-center items-center bg-base-100 h-screen">
        <span className="sr-only">Loading...</span>
        <div className="h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-primary rounded-full animate-bounce"></div>
      </main>
    );
}