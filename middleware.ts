import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/chat(.*)",
  "/jobs(.*)",
  "/api/upload(.*)",
  "/api/parse-resume(.*)",
  "/api/generate-resume(.*)",
  "/api/chat(.*)",
  "/api/export(.*)",
  "/api/jobs(.*)",
  "/api/score-resume(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
