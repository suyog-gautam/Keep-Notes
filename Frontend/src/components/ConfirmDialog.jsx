// ConfirmDialog.jsx
import React from "react";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export const ConfirmDialog = ({ title, description, noteId, triggerText }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/deleteNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/");
        window.location.reload(false);
      } else {
        toast.error(data.message || "Failed to delete note");
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("An error occurred while deleting the note");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent p-0">
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-blue-600 text-white hover:bg-blue-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#f05556] hover:bg-[#e85050] text-white"
            onClick={() => handleDelete()}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
