import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ulid } from "ulid";
import { orderBy } from "lodash-es";

export const File = z.object({
  id: z.string().min(1),
  parentFileIds: z.array(z.string().min(1)),
  type: z.enum(["file", "folder"]),
  name: z.string().min(1),
  content: z.string(),
});

export type File = z.infer<typeof File>;

export const CreateFileInput = File.omit({ id: true });

export type CreateFileInput = z.infer<typeof CreateFileInput>;

const files: File[] = [
  {
    id: ulid(),
    type: "file",
    parentFileIds: [],
    name: "Text file 1",
    content: "This is the content for Text file 1.",
  },
  {
    id: ulid(),
    type: "file",
    parentFileIds: [],
    name: "Text file 3",
    content: "This is the content for Text file 3.",
  },
  {
    id: ulid(),
    parentFileIds: [],
    type: "folder",
    name: "Folder 2",
    content: "",
  },
  {
    id: ulid(),
    parentFileIds: [],
    type: "file",
    name: "Text file 2",
    content: "This is the content for Text file 2.",
  },
  {
    id: ulid(),
    type: "folder",
    parentFileIds: [],
    name: "Folder 1",
    content: "",
  },
];

export const fileRouter = router({
  list: publicProcedure
    .input(z.object({ parentFileId: z.string().optional() }))
    .query(async ({ input }): Promise<{ files: File[] }> => {
      const { parentFileId } = input;

      const filteredFiles = files.filter(
        (file) =>
          file.parentFileIds[file.parentFileIds.length - 1] === parentFileId
      );

      return {
        files: orderBy(filteredFiles.reverse(), { type: "file" }),
      };
    }),
  search: publicProcedure
    .input(z.object({ query: z.string().min(3) }))
    .query(async ({ input }): Promise<{ files: File[] }> => {
      const { query } = input;

      const filteredFiles = files.filter(
        (file) =>
          file.name.toLowerCase().includes(query) ||
          file.content.toLowerCase().includes(query)
      );

      return {
        files: orderBy(filteredFiles.reverse(), { type: "file" }),
      };
    }),
  byId: publicProcedure
    .input(File.pick({ id: true }))
    .query(async ({ input }) => {
      const { id } = input;

      const file = files.find((file) => file.id === id);

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No file with id '${id}'`,
        });
      }

      return file;
    }),
  create: publicProcedure
    .input(CreateFileInput)
    .mutation(async ({ input }): Promise<File> => {
      const file: File = {
        id: ulid(),
        ...input,
      };

      files.push(file);

      return file;
    }),
});
