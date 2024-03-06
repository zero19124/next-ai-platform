import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
// import { Configuration, OpenAIApi } from "openai";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import axios from "axios";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if (!isPro) {
    //   await incrementApiLimit();
    // }
    const token = await axios
      .get(
        `
https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=3kfh2BqO9Kp403O35PwDhZXC&client_secret=Jjk58pT6R2JIcrI3R0QnHGqGUFRWQRBA
`,
        {}
      )
      .then((res) => {
        const access_token = res.data?.access_token;
        console.log(res.data.access_token, "ressss");
        return access_token;
      })
      .catch(() => {});
    return NextResponse.json({ token });
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
