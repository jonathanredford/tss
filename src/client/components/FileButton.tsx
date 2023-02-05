import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ButtonBase } from "@mui/material";
import { FolderOutlined, InsertDriveFileOutlined } from "@mui/icons-material";
import { File } from "server/routers/file";
import { useRouter } from "next/router";

type Props = { file: File };

export const FileButton = (props: Props) => {
  const { file } = props;

  const router = useRouter();

  return (
    <ButtonBase
      sx={{ display: "block" }}
      onDoubleClick={() =>
        router.push(
          `/${[...file.parentFileIds, file.id].join("/")}${
            file.type === "file" ? "/view" : ""
          }`
        )
      }
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          backgroundColor: "#e3e7ef",
          borderRadius: 1,
        }}
      >
        {file.type === "file" ? (
          <InsertDriveFileOutlined fontSize="medium" />
        ) : (
          <FolderOutlined fontSize="medium" />
        )}
      </Box>
      <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
        {file.name}
      </Typography>
    </ButtonBase>
  );
};
