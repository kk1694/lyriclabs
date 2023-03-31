import React, { PropsWithChildren } from "react";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import LoadingSpinner from "~/components/LoadingSpinner";

import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";

const SideBar = () => {
  const [navbarHidden, setNavbarHidden] = useState(true);

  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    throw new Error("User is not loaded");
  }

  if (!isSignedIn) {
    throw new Error("User is not signed in");
  }

  const { data, isLoading } = api.poems.fromUser.useQuery();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setNavbarHidden((prev) => !prev);
        }}
        className="ml-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        className={`top-30 fixed left-0 z-40 h-screen w-64  transition-transform ${
          navbarHidden ? "-translate-x-full sm:translate-x-0" : ""
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col justify-between overflow-y-clip bg-slate-200 px-3 py-4">
          <div className="h-full overflow-y-auto ">
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="#"
                  className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    fill="currentColor"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M19 13h-6v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1 0-2h6V5a1 1 0 0 1 2 0v6h6a1 1 0 0 1 0 2z" />
                  </svg>

                  <span className="ml-3">New</span>
                </a>
              </li>
              {isLoading && <LoadingSpinner />}
              {data?.map((poem) => (
                <li key={poem.id}>
                  <Link
                    href={`/poems/${poem.id}`}
                    className="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    <svg
                      height="24"
                      width="24"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-5.12 -5.12 522.24 522.24"
                      fill="#000000"
                      stroke="#000000"
                      stroke-width="9.728"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke="#CCCCCC"
                        stroke-width="20.48"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fill="#e2e8f0"
                          d="M140.874,375.715H89.04c-36.573,0-66.221,29.647-66.221,66.221l0,0 c0,36.573,29.647,66.221,66.221,66.221h177.671v-97.646L140.874,375.715z"
                        ></path>{" "}
                        <path
                          fill="#e2e8f0"
                          d="M360.768,136.285L150.707,3.843H84.011l0,0c-63.144,0-103.656,67.127-74.229,122.995l143.846,273.09 h-0.023c26.39,48.886-9.012,108.229-64.566,108.229h349.485c55.555,0,90.956-59.342,64.566-108.229L360.768,136.285z"
                        ></path>{" "}
                        <path
                          fill="#e2e8f0"
                          d="M84.011,3.843c36.573,0,66.221,29.649,66.221,66.221l0,0c0,36.573-29.649,66.221-66.221,66.221 h276.757c36.573,0,66.221-29.649,66.221-66.221l0,0c0-36.573-29.649-66.221-66.221-66.221C360.768,3.843,84.011,3.843,84.011,3.843z "
                        ></path>{" "}
                      </g>
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      {poem.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="">
            <SignOutButton>
              <button className="flex h-16 w-full gap-4 rounded-lg p-2 font-medium text-gray-900 hover:bg-gray-100">
                <Image
                  src={user.profileImageUrl}
                  alt="profile picture"
                  className="h-12 w-12 rounded-full"
                  width={48}
                  height={48}
                />
                <p className="flex h-full grow items-center">Log out</p>
              </button>
            </SignOutButton>
          </div>
        </div>
      </aside>
    </>
  );
};

export const SignedInLayout = (props: PropsWithChildren) => {
  return (
    <div className="h-screen w-screen">
      <SideBar />
      <main className="p-4 sm:ml-64">{props.children}</main>
    </div>
  );
};
