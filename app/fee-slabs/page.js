"use client";
export const runtime = "edge";
import React from "react";
import useSWR, { mutate } from "swr";
import { Plus, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { showFeeSlabs, addFeeSlab } from "../actions/feeActions";
import { EmptyValidator } from "@/app/utils/validate";

const fetcher = async () => {
  const { data, error } = await showFeeSlabs();
  if (error) throw error;
  return data;
};

const FeeSlabsManagement = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    data: feeSlabs,
    error,
    isLoading,
    mutate: revalidateFeeSlabs,
  } = useSWR("feeSlabs", fetcher, {
    revalidateOnFocus: false,
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleCreateFeeSlab = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    const data = {
      name: formData.get("name"),
      fees: formData.get("fees"),
      feetype: formData.get("feetype"),
      description: formData.get("description"),
      remark: formData.get("remark") || "No Remark",
    };

    try {
      const check = await EmptyValidator(data);
      if (!check.status) {
        toast.error(check.message);
        return;
      }

      const res = await addFeeSlab(data);

      if (res.status === 201) {
        toast.success("Fee slab created successfully!");
        setIsOpen(false);
        revalidateFeeSlabs();
        event.target.reset();
      } else {
        throw new Error(res.error || "Failed to create fee slab");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Fee Slabs Management</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => revalidateFeeSlabs()} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Fee Slab
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Fee Slab</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateFeeSlab} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" placeholder="Enter name unique to fee slab" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feetype">Recurrence Type</Label>
                      <Select name="feetype" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Recurrence Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="halfyearly">Half-Yearly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fees">Total Amount</Label>
                      <Input name="fees" id="fees" type="number" placeholder="Enter total fee amount" required />
                    </div>
                  </div>
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea name="description" id="description" placeholder="Explain fee details here" required />
                  </div>
                  <div className="col-span-full space-y-2">
                    <Label htmlFor="remark">Remark (Optional)</Label>
                    <Textarea
                      name="remark"
                      id="remark"
                      placeholder="Enter any remark, this will not be displayed to students"
                    />
                  </div>
                  <div className="col-span-full flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Fee Slab"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-500">Failed to load fee slabs. Please try again.</div>
          ) : isLoading ? (
            <div className="text-center py-4 text-muted-foreground">Loading fee slabs...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Recurrence</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Remark</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeSlabs?.map((slab) => (
                    <TableRow key={slab.slab_id}>
                      <TableCell className="font-medium text-primary">{slab.name}</TableCell>
                      <TableCell className="font-medium">₹{slab.amount}</TableCell>
                      <TableCell className="capitalize">{slab.recurrence}</TableCell>
                      <TableCell>{slab.description}</TableCell>
                      <TableCell className="text-muted-foreground">{slab.remark || "No Remark"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(slab.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeeSlabsManagement;
