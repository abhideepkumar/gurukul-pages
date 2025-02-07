"use client";
import React from "react";
import useSWR, { mutate } from "swr";
import { Plus, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { showClasses, addClass } from "../actions/classActions";

const ITEMS_PER_PAGE = 10;

const fetcher = async () => {
  const { data, error } = await showClasses();
  if (error) throw error;
  return data;
};

const ClassManagement = () => {
  const [page, setPage] = React.useState(1);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    data: classes,
    error,
    isLoading,
    mutate: revalidateClasses,
  } = useSWR("classes", fetcher, {
    revalidateOnFocus: false,
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleCreateClass = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    const data = {
      class_name: formData.get("class_name"),
      class_desc: formData.get("class_desc"),
    };

    try {
      await addClass(data);
      toast.success("Class created successfully!");
      setIsOpen(false);
      revalidateClasses();
      event.target.reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = classes ? Math.ceil(classes.length / ITEMS_PER_PAGE) : 0;
  const pageStart = (page - 1) * ITEMS_PER_PAGE;
  const pageEnd = pageStart + ITEMS_PER_PAGE;
  const currentClasses = classes?.slice(pageStart, pageEnd) || [];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Class Management</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => revalidateClasses()} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Class</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateClass} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="class_name">Class Name</Label>
                    <Input id="class_name" name="class_name" placeholder="Enter class name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class_desc">Description</Label>
                    <Textarea id="class_desc" name="class_desc" placeholder="Enter class description" required />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Class"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-500">Failed to load classes. Please try again.</div>
          ) : isLoading ? (
            <div className="text-center py-4 text-muted-foreground">Loading classes...</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">ID</TableHead>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-48">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentClasses.map((classItem) => (
                      <TableRow key={classItem.class_id}>
                        <TableCell className="font-medium">{classItem.class_id}</TableCell>
                        <TableCell>{classItem.class_name}</TableCell>
                        <TableCell>{classItem.class_desc}</TableCell>
                        <TableCell>{new Date(classItem.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassManagement;
