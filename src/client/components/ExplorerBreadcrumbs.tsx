import Link from "client/components/Link";
import { Breadcrumbs, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

export const ExplorerBreadcrumbs = () => {
  const router = useRouter();

  const fileTree = (router.query.fileId as string[]) ?? [];

  const filePathQueries = fileTree
    ? trpc.useQueries((t) =>
        fileTree.flatMap((fileId) =>
          fileId !== "view" ? t.file.byId({ id: fileId }) : []
        )
      )
    : [];

  const breadcrumbsData = filePathQueries.flatMap(({ data: file }, index) => {
    if (file?.name == null || file?.id == null) return [];

    return {
      name: file.name,
      href: `/${filePathQueries
        .slice(0, index + 1)
        .map(({ data: file }) => file?.id ?? "")
        .join("/")}`,
    };
  });

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        {breadcrumbsData.flatMap((breadcrumb, index) => {
          if (breadcrumb.name == null || breadcrumb.href == null) return [];

          const isLastBreadcrumb = index + 1 === breadcrumbsData.length;
          if (isLastBreadcrumb) {
            return (
              <Typography key={index} variant="body1">
                {breadcrumb.name}
              </Typography>
            );
          } else {
            return (
              <Link
                key={index}
                underline="hover"
                color="inherit"
                href={breadcrumb.href}
              >
                {breadcrumb.name}
              </Link>
            );
          }
        })}
      </Breadcrumbs>
    </>
  );
};
