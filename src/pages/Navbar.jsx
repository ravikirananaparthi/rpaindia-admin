import { Component, useContext, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import { PiMicrosoftTeamsLogoFill } from "react-icons/pi";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { MdOutlineMotionPhotosAuto } from "react-icons/md";
import {
  Bars3Icon,
  BellIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  BanknotesIcon,
  UsersIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { useLocation } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { GrArticle } from "react-icons/gr";
// Inside your component:
import { MdOutlineCardMembership } from "react-icons/md";
import { Link, Route, Router, Routes, useNavigate } from "react-router-dom";
import { GrServices } from "react-icons/gr";
import { MdEventNote } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const userNavigation = [
    { name: "My Profile", path: "/admin/profile" },
    { name: "Sign out", path: "/" },
  ];
  const initialNavigation = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: MdOutlineDashboardCustomize,
      current: location.pathname === "/admin/dashboard",
    },
    {
      name: "Team",
      path: "/admin/teams",
      icon: PiMicrosoftTeamsLogoFill,
      current: location.pathname === "/admin/teams",
    },
    {
      name: "Activities",
      path: "/admin/activities",
      icon: MdOutlineMotionPhotosAuto,
      current: location.pathname === "/admin/activities",
    },
    {
      name: "Articles",
      path: "/admin/articles",
      icon: GrArticle,

      current: location.pathname === "/admin/articles",
    },
    {
      name: "Membership",
      path: "/admin/membership",
      icon: MdOutlineCardMembership,

      current: location.pathname === "/admin/membership",
    },
    {
      name: "Services",
      path: "/admin/servicerequests",
      icon: GrServices,

      current: location.pathname === "/admin/servicerequests",
    },
    {
      name: "Events",
      path: "/admin/events",
      icon: MdEventNote,

      current: location.pathname === "/admin/events",
    },
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let default_navigation = initialNavigation[0];
  if (window.location.pathname) {
    const pathName = window.location.pathname;
    const index = initialNavigation.findIndex((item) => item.path === pathName);
    if (index !== -1) {
      default_navigation = initialNavigation[index];
    }
  }
  const [navigation, setNavigation] = useState(default_navigation);
  const navigate = useNavigate();
  const handleNavigation = async (e, item) => {
    e.preventDefault();
    // Update the `current` property for the clicked item

    if (item.name === "Sign out") {
      try {
        await signOut(auth);
        localStorage.clear();
        navigate('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    setNavigation(item);
    // Navigate to the selected path (assuming you have a router)
    // window.location.pathname = path; // Replace this with navigation logic if using `react-router-dom`
    navigate(item.path);
  };
  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden "
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-100/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0 "
          />

          <div className="fixed inset-0 flex ">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full "
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 ring-1 ring-gray-100/10">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://firebasestorage.googleapis.com/v0/b/devfinds-ravi8130.appspot.com/o/simplykart_logo.png?alt=media&token=0e4f12e6-8a97-4713-baf9-dfb8fe381a45"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col ">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li className="cursor-pointer">
                      <ul role="list" className="-mx-2 space-y-1 x">
                        {initialNavigation.map((item) => (
                          <li
                            key={item.name}
                            onClick={(e) => {
                              handleNavigation(e, item);
                              setSidebarOpen(false);
                            }}
                          >
                            <Link
                              className={classNames(
                                item.current
                                  ? "bg-[#1A95DE] text-white"
                                  : "text-gray-700 hover:bg-[#1A95DE] hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className=" shrink-0"
                                size={30}
                              />
                              <p className="text-center text-md">{item.name}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-28 lg:flex-col border border-r-[1.7px] border-gray-200">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col items-centergap-y-5 overflow-y-auto bg-white px-4 pb-1">
            <div className="flex h-16 shrink-0 items-center m-2 mt-3 ">
              <img
                alt="Your Company"
                src="https://firebasestorage.googleapis.com/v0/b/devfinds-ravi8130.appspot.com/o/simplykart_logo.png?alt=media&token=0e4f12e6-8a97-4713-baf9-dfb8fe381a45"
                className="h-14 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col mt-3">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li className="cursor-pointer">
                  <ul role="list" className="-mx-2 space-y-1">
                    {initialNavigation.map((item) => (
                      <li
                        key={item.name}
                        onClick={(e) => handleNavigation(e, item)}
                      >
                        <Link
                          className={classNames(
                            item.current
                              ? "bg-[#1A95DE] text-white"
                              : "text-gray-700 hover:bg-[#1A95DE] hover:text-white",
                            "group flex  flex-col gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <div className="flex flex-col items-center">
                            <item.icon
                              aria-hidden="true"
                              className="size-6 shrink-0 mb-1"
                            />
                            <span className="text-sm/6 text-centre">
                              {item.name}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-28">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-900/10 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div
                action="#"
                method="GET"
                className="grid flex-1 grid-cols-1"
              ></div>
              <div className="flex items-center gap-x-3 lg:gap-x-4">
                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center ">
                    <span className="sr-only">Open user menu</span>
                    <FaRegUserCircle className="size-6" />
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm/6 font-semibold text-gray-900"
                      >
                        {localStorage.getItem("fullName") || "User"}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 size-5 text-gray-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-[250px] origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name} className="cursor-pointer ">
                        <a
                          onClick={(e) => {
                            handleNavigation(e, item);
                          }}
                          className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
