export const runtime = "edge";
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { processPayment } from "../actions/feeActions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const PaymentDialog = ({ selectedReceipts, studentId, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const totalAmount = selectedReceipts.reduce((sum, receipt) => sum + receipt.fee_amount, 0)
  const [isOpen, setIsOpen] = useState(false)
  const [paymentMode, setPaymentMode] = useState("cash")
  const [transactionId, setTransactionId] = useState("")
  const [remark, setRemark] = useState("")

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)
    try {
      const paymentData = {
        studentId,
        selectedReceipts,
        totalAmount,
        paymentMode,
        remark: `${remark}${paymentMode === "online" ? ` (Transaction ID: ${transactionId})` : ""}`,
      }
      console.log("Payment Data:", paymentData)
      const response = await processPayment(paymentData)
      if (response.success) {
        onSuccess()
        setIsOpen(false)
      } else {
        throw new Error("Payment processing failed")
      }
    } catch (err) {
      setError(err.message || "Payment processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={selectedReceipts.length === 0}>
          Process Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Selected Receipts</h4>
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {selectedReceipts.map((receipt, index) => (
                <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>{new Date(receipt.due_date).toLocaleDateString()}</span>
                  <span className="font-medium">₹{receipt.fee_amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger id="paymentMode">
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMode === "online" && (
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="remark">Remark</Label>
              <Textarea
                id="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter any additional remarks"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <>
                Processing... <Progress value={80} className="ml-2" />
              </>
            ) : (
              "Confirm Payment"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

