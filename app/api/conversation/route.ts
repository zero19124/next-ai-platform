import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import axios from "axios";
import { env } from "process";
import { redirect } from "next/navigation";
export async function POST(req: Request, res: Response) {
  try {
    const { userId } = auth();
    const body = await req.json();
    // console.log(body, "body-convo");
    const { messages, token } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!token) {
      console.log("null token");
      return redirect("/dashboard");
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    console.log(1111111);

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    console.log(22222222);

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }
    console.log(3333333);
    let response;
    if (process.env.NODE_ENV === "production") {
      response = await axios.post(
        // "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_speed?access_token=" +
        //   token,
        "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=" +
          token,
        {
          messages,
          disable_search: false,
          enable_citation: false,
        }
      );
    } else {
      response = { data: { result: "mockssssss" } };
    }

    console.log(response.data, "response");
    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json({
      role: "assistant",
      content: response.data.result,
    });
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
