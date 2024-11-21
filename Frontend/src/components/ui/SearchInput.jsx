"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchInput({ searchQuery, setSearchQuery }) {
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="w-full max-w-sm relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder="Search Notes"
        className="bg-muted/50 pl-8 pr-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
          onClick={handleClearSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
