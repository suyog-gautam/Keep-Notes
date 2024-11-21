"use client";

import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function NoSearch({ query }) {
  return (
    <div className="flex flex-col items-center justify-center h-85 py-8  mt-40">
      <AlertCircle className="w-24 h-24 text-blue-500 mb-6 " p-10 />
      <h1 className="text-center text-2xl font-semibold mb-2">
        No Search Results Found for{" "}
        <span className="text-blue-500">"{query}"</span>
      </h1>
      <Link to="/">
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          Go Back
        </Button>
      </Link>
    </div>
  );
}
