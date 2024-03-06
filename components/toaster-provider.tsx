"use client";

import { Toaster } from "react-hot-toast";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect } from "react";
import axios from "axios";

export const ToasterProvider = () => {
  const { setToken, accessToken } = useTokenStore();

  useEffect(() => {
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
  return <Toaster />;
};
