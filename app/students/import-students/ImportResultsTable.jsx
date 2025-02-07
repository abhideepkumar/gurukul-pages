"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ImportResultsTable({ passedRecords, failedRecords }) {
  const renderTable = (records) => (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Admission ID</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.full_name}</TableCell>
              <TableCell>{record.admission_id}</TableCell>
              <TableCell>{record.classname}</TableCell>
              <TableCell>{record.roll_number}</TableCell>
              <TableCell>
                {record.success ? (
                  <span className="text-green-600">{record?.message}</span>
                ) : (
                  <span className="text-red-600"> {record?.message.details || "Failed"} </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );

  const convertToCSV = (records) => {
    const headers = [
      "full_name",
      "admission_id",
      "dob",
      "phone_no",
      "fatherName",
      "classname",
      "roll_number",
      "address",
      "fee_types",
    ];

    const csvRows = records.map((record) =>
      headers
        .map((header) => {
          let value = record[header];
          // Wrap the address in quotes to handle commas
          if (header === "address") {
            value = `"${value}"`;
          }
          return value;
        })
        .join(",")
    );

    return [headers.join(","), ...csvRows].join("\n");
  };

  const downloadFailedRecordsCSV = () => {
    const csv = convertToCSV(failedRecords);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "failed_records.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Tabs defaultValue="passed" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="passed">Passed ({passedRecords.length})</TabsTrigger>
        <TabsTrigger value="failed">Failed ({failedRecords.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="passed">{renderTable(passedRecords)}</TabsContent>
      <TabsContent value="failed">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Failed Records</h3>
          <Button onClick={downloadFailedRecordsCSV} disabled={failedRecords.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download Failed Records
          </Button>
        </div>
        {renderTable(failedRecords)}
      </TabsContent>
    </Tabs>
  );
}
