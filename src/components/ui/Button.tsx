import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ButtonProps extends MuiButtonProps {
  glow?: boolean;
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'glow',
})<ButtonProps>(({ theme, glow, variant }) => ({
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 24px',
  ...(glow && variant === 'contained' && {
    boxShadow: `0 0 20px ${theme.palette.primary.main}55`,
    '&:hover': {
      boxShadow: `0 0 25px ${theme.palette.primary.main}88`,
    }
  })
}));

/**
 * [ATOM] Chuẩn Button TechZone theo Kiến trúc MUI
 */
export function Button({ children, glow = false, ...props }: ButtonProps) {
  return (
    <StyledButton glow={glow} disableElevation {...props}>
      {children}
    </StyledButton>
  );
}
