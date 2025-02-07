"use client";
export const runtime = "edge";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showFeeSlabs } from "@/app/actions/feeActions";
import { showClasses } from "@/app/actions/classActions";
import { addNewStudent, fetchAllStudents } from "@/app/actions/studentActions";
import toast from "react-hot-toast";
import { YearPicker } from "@/components/ui/year-picker";
import { handleFetch } from "@/app/utils/handleFetch";

const InputField = ({ id, label, placeholder }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} name={id} placeholder={placeholder} />
  </div>
);

export default function AddStudentPage() {
  const [selectedFees, setSelectedFees] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [allFeeSlabs, setAllFeeSlabs] = useState([]);
  const [dob, setDob] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleFetch(showClasses, "classes", "add");
        await handleFetch(showFeeSlabs, "feeSlabs", "add");
        await handleFetch(fetchAllStudents, "students", "add");
        const classesData = JSON.parse(sessionStorage.getItem("classes") || "[]");
        const feeSlabsData = JSON.parse(sessionStorage.getItem("feeSlabs") || "[]");
        setAllClasses(classesData.data);
        setAllFeeSlabs(feeSlabsData.data);
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFeeSelection = (feeSlab) => {
    setSelectedFees((prev) => {
      const newSelectedFees = { ...prev };
      if (newSelectedFees[feeSlab.slab_id]) {
        delete newSelectedFees[feeSlab.slab_id];
      } else {
        newSelectedFees[feeSlab.slab_id] = feeSlab;
      }
      return newSelectedFees;
    });
  };

  const selectedFeesText =
    Object.values(selectedFees)
      .map((slab) => `${slab.name} - ₹${slab.amount}`)
      .join(", ") || "Select all fees that apply";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      full_name: event.target.full_name.value,
      admission_id: event.target.admission_id.value,
      dob,
      phone_no: event.target.phone_no.value,
      fatherName: event.target.fatherName.value,
      classname: selectedClass,
      roll_number: event.target.roll_number.value,
      address: event.target.address.value,
      fees: Object.values(selectedFees), // Sending full fee slab objects
    };

    try {
      const result = await addNewStudent(formData);
      console.log("Form Data Submitted:", result);
      if (result.error != null) {
        throw new Error(result.error.message);
      }
      toast.success(`Student ${formData?.admission_id} added successfully!`);
      event.target.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-3xl rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Add a Student</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField id="full_name" label="Full Name" placeholder="Enter student's name" />
              <InputField id="admission_id" label="Admission ID" placeholder="Enter admission ID" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <YearPicker date={dob} setDate={setDob} />
              </div>
              <InputField id="phone_no" label="Phone Number" placeholder="Enter phone number" />
            </div>
            <InputField id="fatherName" label="Father's Name" placeholder="Enter father's name" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="classname">Class</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {selectedClass || "Select Class"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select a Class/Grade</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allClasses?.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.class_id}
                        value={option.class_name}
                        onSelect={() => setSelectedClass(option.class_name)}
                      >
                        {option.class_name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <InputField id="roll_number" label="Roll No. (Optional)" placeholder="Enter roll number" />
            </div>
            <InputField id="address" label="Address" placeholder="Enter permanent address" />
            <div className="space-y-2">
              <Label htmlFor="fee-structures">Add Fee Structures</Label>
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {selectedFeesText}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select Fee Structures</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allFeeSlabs?.map((slab) => (
                    <DropdownMenuCheckboxItem
                      key={slab.slab_id}
                      checked={!!selectedFees[slab.slab_id]}
                      onCheckedChange={() => toggleFeeSelection(slab)}
                      onSelect={(event) => event.preventDefault()}
                    >
                      {slab.name} - ₹{slab.amount}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4 p-6">
            <Button type="button" variant="outline" className="text-red-500">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
