import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RedirectWithToast } from "./RedirectWithToast";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { toast } from "sonner";
export function Logout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleConfirmLogout = () => {
    // Remove userId and token from local storage
    localStorage.removeItem("userId");
    localStorage.removeItem("token");

    navigate("/login");
    window.location.reload();
    // Close the dialog
    setOpen(false);
    toast.success("Logged out Successfully");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className="cursor-pointer p-2 text-sm  hover:bg-gray-100 rounded-md">
          Logout
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will log you out and redirect you to the login page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmLogout}
            className="hover:bg-accent"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
