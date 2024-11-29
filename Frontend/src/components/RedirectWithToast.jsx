import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const RedirectWithToast = ({ to, message }) => {
  const navigate = useNavigate();
  useEffect(() => {
    toast(message);
    navigate(to);
  }, [navigate, to, message]);
  return null;
};
