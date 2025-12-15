import Card, { CardProps } from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { SxProps } from "@mui/system";

interface CustomCardProps extends CardProps {
    sx?: SxProps;
}

export const CustomCard = styled(({ sx, ...other }: CustomCardProps) => (
    <Card sx={sx} {...other} />
))(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    maxWidth: "450px"
}));
