
import Button, { ButtonProps } from "@mui/material/Button";

type MyButtonProps = ButtonProps & {
  label: string;
};

export default function MyButton({ label, ...rest }: MyButtonProps) {
  return <Button {...rest}>{label}</Button>;
}