import { Box, Breadcrumbs, Link, Typography } from "@mui/material";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type CustomBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function CustomBreadcrumbs({ items }: CustomBreadcrumbsProps) {
  return (
    <Box
      component="header"
      position="relative"
      p={2}
      mt={8}
      display="flex"
      justifyContent="flex-start"
      bgcolor="white"
      sx={{
        width: "100%",
        boxSizing: "border-box",
        "@media (max-width: 600px)": {
          justifyContent: "center",
          p: 1, 
          mt: 4, 
        },
      }}
    >
      <Breadcrumbs aria-label="breadcrumb" separator="›">
        {items.map((item, index) =>
          item.href ? (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              href={item.href}
              sx={{ pl: index > 0 ? 2 : 0 }} // Add padding-left except for the first item
            >
              {item.label}
            </Link>
          ) : (
            <Typography key={index} color="text.primary">
              {item.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </Box>
  );
}
