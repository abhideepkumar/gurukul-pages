export const runtime = "edge";
import React, { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { StudentDetails } from "./StudentDetails"

const StudentDetailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[600px] col-span-2" />
            <Skeleton className="h-[600px]" />
          </div>
        </div>
      }
    >
      <StudentDetails />
    </Suspense>
  )
}

export default StudentDetailPage

