import { Box, Button, Input } from "@mui/material";
import { zodResolver } from "client/libs/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SearchOutlined } from "@mui/icons-material";

const SearchFormData = z.object({
  query: z.string().min(3),
});

export const SearchForm = () => {
  const router = useRouter();

  const { register, handleSubmit } = useForm({
    reValidateMode: "onSubmit",
    resolver: zodResolver(SearchFormData),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = () =>
    handleSubmit(async (data) => {
      router.push(`/search?query=${data.query}`);
    })();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex" }}>
        <Input
          {...register("query", { required: true })}
          sx={{
            flex: "1",
            border: "1px solid #e0e0e0",
            px: 1,
            color: "#8c8c8c",
          }}
          placeholder="Search..."
          disableUnderline={true}
        />

        <Button variant="text" type="submit">
          <SearchOutlined />
        </Button>
      </Box>
    </form>
  );
};
