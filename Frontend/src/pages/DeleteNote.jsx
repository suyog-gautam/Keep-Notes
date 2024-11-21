import React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export const DeleteNote = ({ noteId }) => {
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
        toast.success("Note deleted successfully");
        navigate("/");
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
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Trash2 className="h-4 w-4 text-red-500" />
          <span className="sr-only">Delete note</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Note</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-blue-600 text-white hover:bg-blue-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
