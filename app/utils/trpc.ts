import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { appRouter } from "@/server/routers"; // Adjust the path based on your structure

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // If we're in the browser, use relative path
    return "";
  }
  // If we're on the server, return full URL
  return `http://localhost:${process.env.PORT ?? 3001}`;
}

export const trpc = createTRPCNext<typeof appRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            // Optionally include headers here, such as auth tokens
            return {
              // 'Authorization': ctx?.req?.headers?.authorization ?? "",
            };
          },
        }),
      ],
    };
  },
  ssr: false, // Set to true if you're using Server-Side Rendering (SSR)
});

