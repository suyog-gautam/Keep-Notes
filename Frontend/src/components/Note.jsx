import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "./ConfirmDialog";
import DOMPurify from "dompurify";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteNote } from "@/pages/DeleteNote";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
export function Note({ setNotesExist }) {
  let navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not logged in");
        setNotesExist(false); // No notes to display
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/getNotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();

        if (data.success) {
          setNotes(data.data);
          setNotesExist(data.data.length > 0); // Update Home component's state
        } else {
          setError(data.message || "No notes found");
          setNotesExist(false); // No notes to display
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to fetch notes");
        setNotesExist(false); // Error occurred, no notes available
      }
    };

    fetchNotes();
  }, [setNotesExist]);

  const truncateContent = (content, wordLimit = 27) => {
    const words = content.split(" ");
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const containsMedia = (content) => {
    return /<img|<video|<iframe/.test(content);
  };

  const renderTruncatedContent = (content) => {
    const truncated = truncateContent(content);
    return DOMPurify.sanitize(truncated, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    });
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {notes.map((note) => (
          <Card key={note._id} className="flex flex-col">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  {note.title}
                </div>
                {note.isImportant && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Important
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{note.description}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div
                className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: renderTruncatedContent(note.content),
                }}
              />
              {note.content.split(" ").length > 27 ||
              containsMedia(note.content) ? (
                <Link to={`/singlenote/${note._id}`}>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-black text-sm "
                  >
                    ... Show more
                  </Button>
                </Link>
              ) : null}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{note.date}</span>
              <div className="flex gap-2">
                <ConfirmDialog
                  title="Delete Note"
                  description="Are you sure you want to delete this note? This action cannot be undone."
                  triggerText={
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete note</span>
                    </Button>
                  }
                  noteId={note._id}
                />

                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4 text-slate-500" />
                  <span className="sr-only">Edit note</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
