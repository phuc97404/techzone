import { Card as MuiCard, CardProps as MuiCardProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(MuiCard)(({ theme }) => ({
  background: 'rgba(30, 41, 59, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)',
    borderColor: theme.palette.primary.main + '44',
  }
}));

/**
 * [ATOM] Card chuẩn TechZone (Glassmorphism)
 */
export function Card({ children, ...props }: MuiCardProps) {
  return <StyledCard {...props}>{children}</StyledCard>;
}
