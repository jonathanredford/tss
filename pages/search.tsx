import { Container } from "@mui/material";
import { FileSearch } from "client/components/FileSearch";

const FileSearchPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <FileSearch />
    </Container>
  );
};

export default FileSearchPage;
