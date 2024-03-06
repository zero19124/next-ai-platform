"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { tools } from "@/constants";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { setToken, accessToken } = useTokenStore();

  useEffect(() => {
    setToken('24.57c2c463cf7f4d536b4ca29b859c281a.2592000.1712311086.282335-55385369');

    // if (!accessToken) {
    //   axios
    //     .get(
    //       `
    // https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=3kfh2BqO9Kp403O35PwDhZXC&client_secret=Jjk58pT6R2JIcrI3R0QnHGqGUFRWQRBA
    // `
    //     )
    //     .then((res) => {
    //       const access_token = res.data?.access_token;
    //       console.log(res.data.access_token, "ressss");
    //       setToken(access_token);
    //       console.log(accessToken, "accessToken-28");
    //     })
    //     .catch(() => {
    //       console.log(accessToken, "accessToken-error");
    //     });
    // } else {
    //   console.log(accessToken, "accessToken-is");
    // }
  }, []);
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with the smartest AI - Experience the power of AI
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
}
