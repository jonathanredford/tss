import { Container } from "@mui/material";
import { FileExplorer } from "client/components/FileExplorer";
import { FileViewer } from "client/components/FileViewer";
import { useRouter } from "next/router";

const FileExplorerPage = () => {
  const router = useRouter();

  const fileTree = (router.query.fileId as string[]) ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {fileTree[fileTree.length - 1] === "view" ? (
        <FileViewer />
      ) : (
        <FileExplorer />
      )}
    </Container>
  );
};

export default FileExplorerPage;
