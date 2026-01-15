"use client";

import { CartDrawer } from "@/components/store/cart-drawer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { storeConfig } from "@/config/store";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/stores/cart-store";
import { LogIn, LogOut, Menu, Settings, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Ofertas", href: "/productos?ofertas=true" },
  { name: "Contacto", href: "/#contacto" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    email?: string;
    isAdmin?: boolean;
  } | null>(null);
  const isMounted = useIsMounted();
  const { openCart, getItemCount } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth state
  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        // Set user first, then check if admin
        let isAdmin = false;
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", authUser.id)
            .single();
          isAdmin = profile?.role === "admin";
        } catch {
          // Profile query might fail due to RLS, that's okay
        }

        setUser({
          email: authUser.email,
          isAdmin,
        });
      } else {
        setUser(null);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const itemCount = isMounted ? getItemCount() : 0;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Mobile menu button - Left */}
            <div className="w-20 lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Logo - Centered on mobile, left on desktop */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 lg:static lg:translate-x-0 lg:flex-1"
            >
              <Image
                src="/logo-glamify-makeup.jpeg"
                alt={storeConfig.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="hidden text-xl font-bold sm:block">
                <span className="text-foreground">Glamify</span>
                <span className="text-primary"> Makeup</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:gap-8 lg:flex-1 lg:justify-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions - Right */}
            <div className="flex w-20 items-center justify-end gap-1 lg:w-auto lg:flex-1 lg:gap-2">
              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {user.isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Panel Admin
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hidden sm:flex"
                >
                  <Link href="/auth/login">Iniciar sesión</Link>
                </Button>
              )}
              {/* Mobile login icon */}
              {!user && (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="sm:hidden"
                >
                  <Link href="/auth/login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )}

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={openCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-80 px-6">
          <div className="flex flex-col gap-6 pt-6">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/logo-glamify-makeup.jpeg"
                alt={storeConfig.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold">
                <span className="text-foreground">Glamify</span>
                <span className="text-primary"> Makeup</span>
              </span>
            </Link>

            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Links */}
            <div className="border-t pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-lg font-medium text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      Panel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-lg font-medium text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 text-lg font-medium text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
