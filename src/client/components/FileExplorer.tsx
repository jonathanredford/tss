import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, Grid } from "@mui/material";
import { FileButton } from "./FileButton";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { ExplorerBreadcrumbs } from "./ExplorerBreadcrumbs";
import { useMemo } from "react";
import CreateNewFileButton from "./CreateNewFileButton";
import { SearchForm } from "./forms/SearchForm";

export const FileExplorer = () => {
  const router = useRouter();

  const fileTree = (router.query.fileId as string[]) ?? [];

  const fileQuery = trpc.file.list.useQuery({
    parentFileId: fileTree ? fileTree[fileTree.length - 1] : undefined,
  });

  const { data } = fileQuery;

  const counts = useMemo(() => {
    return {
      folders: data?.files.filter((file) => file.type === "folder").length,
      files: data?.files.filter((file) => file.type === "file").length,
    };
  }, [data]);

  return (
    <>
      <SearchForm />
      <Box sx={{ my: 2, display: "flex" }}>
        <CreateNewFileButton sx={{ mr: 1 }} type="file" />
        <CreateNewFileButton type="folder" />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <ExplorerBreadcrumbs />

        {fileTree.length > 0 ? (
          <Button
            variant="text"
            onClick={() => history.back()}
            sx={{ color: "text.secondary" }}
          >
            Back
          </Button>
        ) : null}
      </Box>

      <Box sx={{ p: 2, border: "1px solid #e0e0e0" }}>
        <Grid container spacing={2}>
          {data?.files.map((file) => (
            <Grid key={file.id} item>
              <FileButton file={file} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography color="text.secondary" sx={{ textAlign: "right", mt: 1 }}>
        Total: {counts.files} {counts.files !== 1 ? "files" : "file"} and{" "}
        {counts.folders} {counts.folders === 1 ? "folder" : "folders"}
      </Typography>
    </>
  );
};
