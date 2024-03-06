import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// // This function can be marked `async` if using `await` inside
// export function middleware(request) {
//   if (request.nextUrl.pathname.startsWith("/api")) {
//     const hostname = process.env.HOST;

//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set("host", hostname);

//     let url = request.nextUrl.clone();
//     // url.protocol = 'https'
//     url.hostname = hostname;
//     url.port = process.env.HOSTPORT;
//     url.pathname = url.pathname.replace(/^\/api/, "");

//     return NextResponse.rewrite(url, {
//       headers: requestHeaders,
//     });
//   }
// }
