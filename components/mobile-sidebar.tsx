"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { TApiLimitCount } from "@/lib/api-limit";
import { useTokenStore } from "@/store/useTokenStore";
import axios from "axios";

export const MobileSidebar = ({
  apiLimitCount,
  isPro = false,
}: {
  apiLimitCount: TApiLimitCount;
  isPro: boolean;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { setToken, accessToken } = useTokenStore();

  useEffect(() => {
    setIsMounted(true);
    if (!accessToken) {
      axios.get("/api/auth").then(({ data }) => {
        console.log(data.token, "token");
        setToken(data.token);
        console.log(accessToken, "accessToken");
      });
    } else {
      console.log(accessToken, "accessToken-is");
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  );
};
