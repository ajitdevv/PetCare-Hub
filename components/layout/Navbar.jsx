"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  PawPrint,
  Settings,
  ShoppingBag,
  User,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, logoutUser } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Products", path: "/products", icon: ShoppingBag }
  ];

  if (user && user.role !== "admin") {
    navItems.push({ name: "Dashboard", path: "/dashboard", icon: User });
    navItems.push({ name: "My Pets", path: "/pets", icon: PawPrint });
    navItems.push({ name: "Services", path: "/services", icon: Calendar });
    navItems.push({ name: "Support", path: "/complaints", icon: MessageSquare });
  }

  if (user?.role === "admin") {
    navItems.push({ name: "Admin Dash", path: "/admin/dashboard", icon: Settings });
    navItems.push({ name: "Manage Products", path: "/admin/products", icon: ShoppingBag });
    navItems.push({ name: "Tickets", path: "/admin/complaints", icon: MessageSquare });
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleLogout() {
    await logoutUser();
    setIsOpen(false);
    router.push("/login");
  }

  return (
    <div
      className={`sticky z-50 transition-all duration-300 ${
        isScrolled ? "top-0 px-0" : "top-8 px-4 sm:px-6 lg:px-8"
      }`}
    >
      <nav
        className={`mx-auto border backdrop-blur-xs transition-all duration-300 ${
          isScrolled
            ? "max-w-none rounded-none border-white/50 bg-white/70 shadow-md shadow-slate-900/5"
            : "max-w-7xl rounded-3xl border-white/70 bg-white/90 shadow-lg shadow-slate-900/5"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-2 text-primary-600 transition hover:text-primary-700"
              >
                <PawPrint size={28} className="text-primary-500" />
                <span className="hidden text-xl font-bold tracking-tight sm:block">
                  PetCare Hub
                </span>
              </Link>

              <div className="hidden md:ml-10 md:flex md:space-x-4 lg:space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.path ||
                    (item.path !== "/" && pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={`inline-flex items-center gap-2 border-b-2 px-1 pt-1 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-primary-500 text-primary-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      <Icon size={16} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex md:items-center">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="hidden text-sm font-medium text-gray-700 lg:block">
                    {user.name} ({user.role})
                  </span>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login">
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen((current) => !current)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 flex h-full w-4/5 max-w-sm flex-col bg-white pt-20 shadow-2xl md:hidden"
            >
              <div className="absolute left-4 top-4 pt-1">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-primary-600">
                  <PawPrint size={24} />
                  <span className="text-lg font-bold">PetCare Hub</span>
                </Link>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-50"
              >
                <X size={24} />
              </button>

              <div className="mt-4 flex-1 space-y-2 overflow-y-auto px-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.path ||
                    (item.path !== "/" && pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                        isActive
                          ? "bg-primary-50 text-primary-600 shadow-sm shadow-primary-100/50"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={20} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 bg-gray-50 p-6">
                {user ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs capitalize text-gray-500">{user.role}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start rounded-xl px-4 text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={20} className="mr-3" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="h-auto w-full py-3">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="h-auto w-full py-3">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
