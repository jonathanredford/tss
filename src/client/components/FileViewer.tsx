import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { ExplorerBreadcrumbs } from "./ExplorerBreadcrumbs";
import { useMemo } from "react";

export const FileViewer = () => {
  const router = useRouter();

  const fileTree = (router.query.fileId as string[]) ?? [];

  const fileId = useMemo(() => fileTree[fileTree.length - 2], [fileTree]);

  const fileQuery = trpc.file.byId.useQuery({
    id: fileId,
  });

  const { data: file } = fileQuery;

  return (
    <>
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

      <Typography variant="body1">{file?.name}</Typography>

      <Box sx={{ p: 2, border: "1px solid #e0e0e0" }}>
        <pre>{file?.content}</pre>
      </Box>
    </>
  );
};
