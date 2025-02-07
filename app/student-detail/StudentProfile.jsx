export const runtime = "edge";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Phone, Mail, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateStudentDetails } from "../actions/studentActions";
import { Label } from "@/components/ui/label";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-2">
    <Icon className="h-5 w-5 text-gray-500" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || "N/A"}</p>
    </div>
  </div>
);

export const StudentProfile = ({ student }) => {
  /* Edit profile state and handlers - Start */
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // const handleUpdateStudent = async (event) => {
  //   event.preventDefault()
  //   const formData = new FormData(event.target)
  //   const updatedData = {
  //     full_name: formData.get("full_name"),
  //     classname: formData.get("classname"),
  //     fee_slab: formData.get("fee_slab"),
  //     // Add other fields as necessary
  //   }

  //   try {
  //     await updateStudentDetails(student.admission_id, updatedData)
  //     // Update the student state or refetch data
  //     setIsEditDialogOpen(false)
  //     // You might want to add a success toast here
  //   } catch (error) {
  //     console.error("Failed to update student details:", error)
  //     // You might want to add an error toast here
  //   }
  // }
  /* Edit profile state and handlers - End */

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{student.full_name}</h2>
            <Badge variant="outline" className="mt-1">
              Class {student.classname}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4">
          <InfoItem icon={Calendar} label="Date of Birth" value={new Date(student.dob).toLocaleDateString()} />
          <InfoItem icon={Phone} label="Phone Number" value={student.phone_no} />
          <InfoItem icon={User} label="Father's Name" value={student.fatherName} />
          <InfoItem icon={Mail} label="Admission ID" value={student.admission_id} />
          <InfoItem icon={MapPinned} label="Address" value={student.address} />
        </div>
        {/* Edit profile button */}
        {/* <Button onClick={() => setIsEditDialogOpen(true)}>Edit Student Details</Button> */}
      </CardContent>

      {/* Edit profile dialog */}
      {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateStudent}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" defaultValue={student.full_name} />
              </div>
              <div>
                <Label htmlFor="classname">Class</Label>
                <Select name="classname" defaultValue={student.classname}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* You'll need to fetch and map through available classes here */}
      {/* <SelectItem value="1">Class 1</SelectItem>
                    <SelectItem value="2">Class 2</SelectItem> */}
      {/* ... */}
      {/* </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fee_slab">Fee Slab</Label>
                <Select name="fee_slab" defaultValue={student.fee_slab}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee slab" />
                  </SelectTrigger>
                  <SelectContent> */}
      {/* You'll need to fetch and map through available fee slabs here */}
      {/* <SelectItem value="1">Slab 1</SelectItem>
                    <SelectItem value="2">Slab 2</SelectItem> */}
      {/* ... */}
      {/* </SelectContent>
                </Select>
              </div> */}
      {/* Add other fields as necessary */}
      {/* <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog> */}
    </Card>
  );
};
