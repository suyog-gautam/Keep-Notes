"use client";

import { FileX2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function NoNotes() {
  return (
    <div className="flex flex-col items-center justify-center   pt-52">
      <FileX2 className="w-24 h-24 text-muted-foreground mb-6" />
      <h1 className="text-center text-2xl font-semibold mb-2">
        You Have No Notes
      </h1>
      <p className="text-center text-muted-foreground mb-6">
        Click On Add Note Button To Add The Note
      </p>
      <Link to="/addNote">
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          Add Note
        </Button>
      </Link>
    </div>
  );
}
