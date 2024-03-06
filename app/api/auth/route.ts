import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const token = await axios
      .get(
        `
https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=3kfh2BqO9Kp403O35PwDhZXC&client_secret=Jjk58pT6R2JIcrI3R0QnHGqGUFRWQRBA
`,
        {}
      )
      .then((res) => {
        const access_token = res.data?.access_token;
        console.log(res.data.access_token, "res.data.access_token");
        return access_token;
      })
      .catch(() => {});
    return NextResponse.json({ token });
  } catch (error) {
    console.log("[TOKEN_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
