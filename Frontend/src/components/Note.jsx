import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { DateFormat } from "./DateFormat";
import { useNavigate } from "react-router-dom";
export function Note({ note }) {
  let navigate = useNavigate();
  const truncateContent = (content, charLimit = 240) => {
    if (content.length <= charLimit) return { text: content, truncated: false };
    return { text: content.slice(0, charLimit), truncated: true };
  };

  const containsMedia = (content) => {
    return /<img|<video|<iframe/.test(content);
  };

  const renderContent = (content) => {
    const { text, truncated } = truncateContent(content);
    const sanitizedContent = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    });

    return (
      <div className="text-sm text-muted-foreground inline">
        <span dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        {(truncated || containsMedia(content)) && (
          <span className="inline-flex items-center gap-1">
            <Link to={`/singlenote/${note._id}`} className="inline-block">
              <Button
                variant="link"
                className="p-0 h-auto font-normal  text-accent text-sm hover:underline"
              >
                Show more
              </Button>
            </Link>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        <Card className="flex flex-col h-[300px]">
          <CardHeader className="">
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">{note.title}</div>
              {note.isImportant && (
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Important
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg line-clamp-1">
              {note.description}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden ">
            <div className="h-[120px] overflow-hidden">
              {renderContent(note?.content)}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <DateFormat date={note.date} />
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

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate(`/editnote/${note._id}`)}
              >
                <Pencil className="h-4 w-4 text-slate-500" />
                <span className="sr-only">Edit note</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
