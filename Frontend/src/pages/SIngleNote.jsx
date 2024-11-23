"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DateFormat } from "@/components/DateFormat";
import { useNavigate } from "react-router-dom";
export function SingleNote() {
  let navigate = useNavigate();
  const { noteId } = useParams(); // Get the note ID from the URL
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/getNote/${noteId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setNote(data.data); // Assuming the backend sends the note in `data.data`
        } else {
          setError(data.message || "Note not found");
        }
      } catch (err) {
        console.error("Error fetching note:", err);
        setError("Failed to fetch note");
      }
    };

    fetchNote();
  }, [noteId]);

  const handleEdit = () => {
    console.log("Edit note:", noteId);
  };

  const handleDelete = () => {
    console.log("Delete note:", noteId);
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="py-8 max-w-2xl mx-auto" style={{ minHeight: "83.5vh" }}>
          <p className="text-red-500 text-center">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!note) {
    return (
      <>
        <Navbar />
        <div className="py-8 max-w-2xl mx-auto" style={{ minHeight: "83.5vh" }}>
          <p className="text-center">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-8 max-w-2xl mx-auto" style={{ minHeight: "83.5vh" }}>
        <Card className="overflow-hidden">
          <CardHeader className="space-y-1">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{note.title}</CardTitle>
                <DateFormat date={note.date} />
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
          </CardHeader>
          <CardContent>
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: note.content,
              }}
            />
          </CardContent>
          <CardFooter className="bg-muted/50 flex justify-between items-center space-x-4 py-4">
            <Button
              variant="outline"
              className="w-[120px] bg-[#2563eb] text-white hover:bg-accent"
              onClick={() => navigate(`/editnote/${note._id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <ConfirmDialog
              title="Delete Note"
              description="Are you sure you want to delete this note? This action cannot be undone."
              triggerText={
                <Button variant="destructive" className="w-[120px]">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              }
              noteId={note._id}
            />
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </>
  );
}
