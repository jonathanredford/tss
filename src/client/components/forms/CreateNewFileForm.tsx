import { Box, Button, Input } from "@mui/material";
import { zodResolver } from "client/libs/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { trpc } from "utils/trpc";
import { z } from "zod";

const CreateNewFileFormData = z.object({
  name: z.string().min(1),
  content: z.string().optional(),
});

type Props = {
  type: "file" | "folder";
  onSuccess: () => void;
  onCancel: () => void;
};

export const CreateNewFileForm = ({ type, onSuccess, onCancel }: Props) => {
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    reValidateMode: "onSubmit",
    resolver: zodResolver(CreateNewFileFormData),
    defaultValues: {
      name: "",
      content: "",
    },
  });

  const fileTree = (router.query.fileId as string[]) ?? [];

  const queryClient = trpc.useContext();

  const createFileMutation = trpc.file.create.useMutation({
    onSuccess({ id, type }) {
      router.push(
        `/${[...fileTree, id].join("/")}${type === "file" ? "/view" : ""}`
      );
      onSuccess();
    },
  });

  const onSubmit = () =>
    handleSubmit(async (data) => {
      try {
        const newFile = {
          parentFileIds: fileTree,
          type: type,
          name: data.name,
          content: data.content,
        };
        await createFileMutation.mutateAsync(newFile);
        await queryClient.file.list.invalidate();
      } catch {}
    })();

  return (
    <Box sx={{ minWidth: "400px" }}>
      <Input
        {...register("name", { required: true })}
        sx={{
          width: "100%",
          border: "1px solid #e0e0e0",
          px: 1,
          color: "#8c8c8c",
        }}
        placeholder="Name..."
        disableUnderline={true}
      />
      {type === "file" && (
        <Input
          {...register("content", { required: type === "file" })}
          multiline
          sx={{
            mt: 2,
            width: "100%",
            border: "1px solid #e0e0e0",
            px: 1,
            color: "#8c8c8c",
          }}
          minRows={4}
          placeholder="File content goes here..."
          disableUnderline={true}
        />
      )}

      <Box sx={{ display: "flex", mt: 2 }}>
        <Button variant="outlined" sx={{ mr: 2 }} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          Create
        </Button>
      </Box>
    </Box>
  );
};
