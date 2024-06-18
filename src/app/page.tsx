"use client";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Account } from "@/utils/custom-type";
import { IoMail, IoKey } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import mascot from "@/../public/asset/image/logoCGC_TW.png";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

export default function SignIn(): JSX.Element {
  const [account, setAccount] = useState<Account>({ email: "", password: "" });
  const [signInText, setSignInText] = useState<boolean>(true);
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const { status } = useSession();
  const router = useRouter();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const setEmail = (email: ChangeEvent<HTMLInputElement>): void => {
    setAccount({ ...account, email: email.target.value });
  };

  const setPassword = (password: ChangeEvent<HTMLInputElement>): void => {
    setAccount({ ...account, password: password.target.value });
  };

  const handleSignIn = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if(signInText){
      setSignInText(false)
      try {
        if (
          account.email.trim().length === 0 ||
          account.password.trim().length === 0
        ) {
          Toast.fire({
            title: "Email or password is blank.",
            icon: "warning",
          }).then(() => {
            setSignInText(true)
          });
        } else {
          const result = await signIn("credentials", {
            redirect: false,
            email: account.email.trim(),
            password: account.password.trim(),
          });
          if (result?.error) {
            Toast.fire({
              title: "Authentication is not valid.",
              icon: "error",
            }).then(() => {
              setSignInText(true)
            });
          } else {
            Toast.fire({
              title: "Authentication is valid.",
              icon: "success",
            }).then(() => {
              setSignInText(true)
            });
            router.push("/dashboard");
          }
        }
      } catch (error) {
        Toast.fire({
          title: "Authentication is not valid.",
          icon: "error",
        });
      }
    }
  };

  return status === "unauthenticated" ? (
    <main className="flex flex-row h-screen">
      <div className="hidden md:flex justify-end items-center flex-1">
      <Image
          onDrag={(event) => event.preventDefault()}
          onDragStart={(event) => event.preventDefault()}
          onMouseDown={(event) => event.preventDefault()}
          onContextMenu={(event) => event.preventDefault()}
          src={mascot}
          alt="Mascot"
          className="hidden md:block w-[80%] animate-[matcot_5s_ease-in-out_infinite]"
          priority={true}
        />
      </div>
      <div className="flex flex-col justify-center items-center md:items-start flex-1">
        <form onSubmit={handleSignIn} className="flex flex-col p-5 rounded gap-5">
          <h2 className="text-nowrap text-5xl md:text-6xl lg:text-7xl leading-relaxed text-center text-primary">
            Sign In Now!!
          </h2>
          <label className="input input-bordered input-primary flex gap-2 text-lg">
            <IoMail className="self-center w-4 h-4 opacity-70" />
            <input
              value={account.email}
              onChange={setEmail}
              type="text"
              placeholder="email"
              className="grow"
            />
          </label>
          <label className="input input-bordered input-primary flex gap-3 text-lg">
            <IoKey className="self-center w-4 h-4 opacity-70" />
            <input
              value={account.password}
              onChange={setPassword}
              type={hidePassword ? "password" : "text"}
              placeholder="password"
              className="grow"
            />
            <button
              type="button"
              onClick={() => setHidePassword(!hidePassword)}
            >
              {hidePassword ? (
                <FaEyeSlash className="self-center w-4 h-4 opacity-70" />
              ) : (
                <FaEye className="self-center w-4 h-4 opacity-70" />
              )}
            </button>
          </label>
          <div className="flex flex-col w-full border-opacity-50">
            <button type="submit" className="text-lg btn btn-primary">
              {signInText ? "Sign In" : <span className="loading loading-dots loading-lg"></span>}
            </button>
            {/* <div className="text-lg divider">OR</div>
          <Link
            href="/forgot-password"
            type="button"
            className="text-lg btn btn-outline btn-primary"
          >
            Forgot password
          </Link> */}
          </div>
        </form>
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
