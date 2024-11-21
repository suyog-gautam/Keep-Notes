import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import JoditEditor from "jodit-react";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  isImportant: z.boolean().optional(),
});

export function AddNote() {
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      description: "",
      isImportant: false,
    },
  });

  // Handle form submission
  async function onSubmit(values) {
    try {
      const response = await fetch("http://localhost:8000/addNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          content: values.content,
          isImportant: values.isImportant,
          uploadedBy: localStorage.getItem("userId"),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast.success(result.message || "Note Added Successfully");
          navigate("/");
          form.reset();
        } else {
          toast.error(result.message || "Failed to Add Note.");
        }
      } else {
        toast.error("Failed to Add Note. HTTP Error.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  }

  return (
    <>
      <Navbar />

      <div
        className="py-8 max-w-3xl mx-auto"
        style={{ minHeight: "calc(100vh - 10rem)" }}
      >
        <h1 className="text-2xl font-semibold mx-auto">
          Add A <span className="text-blue-500">New</span> Note
        </h1>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter note title"
                          className="bg-muted/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter note description"
                          className="max-h-[60px] bg-muted/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isImportant"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-medium">
                        Is Important
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note Content</FormLabel>
                      <FormControl>
                        <Controller
                          name="content"
                          control={form.control}
                          render={({ field: { onChange, value } }) => (
                            <JoditEditor
                              ref={editorRef}
                              value={value}
                              config={{
                                placeholder: "Enter note content",
                                minHeight: 250,
                                maxHeight: 500,
                                buttons: [
                                  "bold",
                                  "italic",
                                  "underline",
                                  "strikethrough",
                                  "link",
                                  "image",
                                  "video",
                                  "table",
                                  "quote",
                                  "align",
                                  "unorderedlist",
                                  "orderedlist",
                                  "outdent",
                                  "indent",
                                  "cut",
                                  "copy",
                                  "paste",
                                  "undo",
                                  "redo",
                                ],
                              }}
                              onBlur={(content) => onChange(content)}
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Create Note
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </>
  );
}
