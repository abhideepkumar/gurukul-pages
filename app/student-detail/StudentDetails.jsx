'use client'
export const runtime = "edge";
import React, { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Receipt, History, CreditCard, ChevronRight, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchAstudent, fetchFutureReceipts, fetchFeeHistory } from "../actions/studentActions"
import { StudentProfile } from "./StudentProfile"
import { PaymentDialog } from "./PaymentDialog"

export const StudentDetails = () => {
  const searchParams = useSearchParams()
  const studentId = searchParams.get("id")
  const [student, setStudent] = useState(null)
  const [futureReceipts, setFutureReceipts] = useState([])
  const [transactionHistory, setTransactionHistory] = useState([])
  const [selectedReceipts, setSelectedReceipts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAllData = useCallback(async () => {
    if (!studentId) return
    setIsLoading(true)
    try {
      const [studentResponse, receiptsResponse, historyResponse] = await Promise.all([
        fetchAstudent(studentId),
        fetchFutureReceipts(studentId),
        fetchFeeHistory(studentId),
      ])
      setStudent(studentResponse.data[0])
      setFutureReceipts(receiptsResponse.data)
      setTransactionHistory(historyResponse.data)
    } catch (err) {
      setError("Failed to fetch student data")
    } finally {
      setIsLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const toggleReceiptSelection = (receipt) => {
    setSelectedReceipts((prev) => {
      const isSelected = prev.some((r) => r.due_date === receipt.due_date)
      return isSelected ? prev.filter((r) => r.due_date !== receipt.due_date) : [...prev, receipt]
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[600px] col-span-2 bg-green-50" />
          <Skeleton className="h-[600px] bg-green-50" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="payments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payments" className="flex items-center">
                <Receipt className="w-4 h-4 mr-2" />
                Pending Payments
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center">
                <History className="w-4 h-4 mr-2" />
                Payment History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="payments">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Selected Receipts Summary */}
                    {selectedReceipts.length > 0 && (
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">Selected Payments</h3>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedReceipts([])}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {selectedReceipts.map((receipt, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{new Date(receipt.due_date).toLocaleDateString()}</span>
                              <span>₹{receipt.fee_amount.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2 font-medium">
                            <div className="flex justify-between">
                              <span>Total</span>
                              <span>₹{selectedReceipts.reduce((sum, r) => sum + r.fee_amount, 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Future Receipts List */}
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {futureReceipts
                          .filter((r) => !r.is_paid)
                          .map((receipt, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${
                                selectedReceipts.some((r) => r.due_date === receipt.due_date)
                                  ? "border-primary bg-primary/5"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => toggleReceiptSelection(receipt)}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <CreditCard className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                  <p className="font-medium">Due Date</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(receipt.due_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="font-medium">₹{receipt.fee_amount.toFixed(2)}</p>
                                  <Badge variant={receipt.is_paid ? "success" : "secondary"} className="mt-1">
                                    {receipt.is_paid ? "Paid" : "Pending"}
                                  </Badge>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>

                    <PaymentDialog
                      selectedReceipts={selectedReceipts}
                      studentId={studentId}
                      onSuccess={() => {
                        setSelectedReceipts([])
                        fetchAllData()
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {transactionHistory.map((transaction, index) => (
                        <div key={index} className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">Payment #{transaction.reference_number}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(transaction.payment_time).toLocaleString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                transaction.status === "Success"
                                  ? "success"
                                  : transaction.status === "Pending"
                                    ? "warning"
                                    : "destructive"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">₹{transaction.amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Payment Method</p>
                              <p className="font-medium">{transaction.payment_method}</p>
                            </div>
                            {transaction.remark && (
                              <div className="col-span-2">
                                <p className="text-gray-500">Remark</p>
                                <p className="font-medium">{transaction.remark}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {transactionHistory.length === 0 && (
                        <div className="text-center py-8">
                          <History className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No transaction history available</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <StudentProfile student={student} />
        </div>
      </div>
    </div>
  )
}

