import { publicProcedure, router } from "../trpc";
import { fileRouter } from "./file";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  file: fileRouter,
});

export type AppRouter = typeof appRouter;
