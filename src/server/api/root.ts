import { adminAuthRouter } from "@/server/api/routers/admin/auth";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

const adminRoutes = {
  // other admin routers can be added here
  admin: {
    auth: adminAuthRouter,
  },
};

const appRoutes = {
  // other routers can be added here
};

export const appRouter = createTRPCRouter({
  ...appRoutes,
  ...adminRoutes,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
