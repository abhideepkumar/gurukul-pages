export const runtime = "edge";
"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "@/assets/icons";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchAllStudents } from "@/app/actions/studentActions";

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const checkStudents = async () => {
      const storedData = JSON.parse(sessionStorage.getItem("students"));
      if (storedData?.success) {
        setStudents(storedData.data);
      } else {
        const response = await fetchAllStudents();
        setStudents(response.data);
        sessionStorage.setItem("students", JSON.stringify(response));
      }
    };
    checkStudents();
  }, [isOpen]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query.trim()) {
        const lowerCaseQuery = query.toLowerCase();
        const filtered = students.filter((student) =>
          Object.values(student).some(
            (value) => typeof value === "string" && value.toLowerCase().includes(lowerCaseQuery)
          )
        );
        setFilteredStudents(filtered);
        setSelectedIndex(-1); // Reset selection when results change
      } else {
        setFilteredStudents([]);
        setSelectedIndex(-1);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, students]);

  const handleKeyDown = (e) => {
    if (filteredStudents.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredStudents.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          window.location.href = `/student-detail/?id=${filteredStudents[selectedIndex].admission_id}`;
          setIsOpen(false);
        }
        break;
    }
  };

  // Open the search dialog with Ctrl + K
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="w-full m-2">
        <Button variant="outline" className="w-full flex items-center justify-center">
          <SearchIcon className="mr-2 h-4 w-4" />
          Search students
          <span className="mx-2 text-xs text-muted-foreground">CTRL + K</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full h-full flex flex-col">
        <DialogTitle>Search Students</DialogTitle>
        <div className="my-4">
          <Input
            type="search"
            placeholder="Search by name, admission ID, phone, etc."
            className="w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        {filteredStudents.length === 0 && query !== "" && (
          <div className="mt-4 text-sm text-muted-foreground">No results found for {query}</div>
        )}
        {filteredStudents.length > 0 && (
          <ul className="mt-4 max-h-60 overflow-y-auto">
            {filteredStudents.map((student, index) => (
              <li
                key={student.id}
                className={`p-2 border-b border-border rounded-md ${
                  index === selectedIndex ? "bg-primary/10" : "hover:bg-gray-100"
                }`}
              >
                <Link href={`/student-detail/?id=${student.admission_id}`} onClick={() => setIsOpen(false)}>
                  <div className="font-semibold">{student.full_name}</div>
                  <div className="text-sm text-muted-foreground">
                    Admission ID: {student.admission_id}, Class: {student.classname}, Phone: {student.phone_no}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Search;