"use client";
export const runtime = "edge";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { lastTransactions } from "@/app/actions/financialActions";

const ITEMS_PER_PAGE = 10;

const TransactionRow = ({ transaction }) => (
  <TableRow>
    <TableCell>
      <div className="font-medium">{new Date(transaction.created_at).toLocaleDateString()}</div>
      <div className="text-sm pt-2">
        {new Date(transaction.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </TableCell>
    <TableCell>{transaction.person_involved}</TableCell>
    <TableCell className={transaction.transaction_type === "withdrawal" ? "text-red-500" : "text-green-500"}>
      {transaction.transaction_type}
    </TableCell>
    <TableCell>{transaction.amount}</TableCell>
    <TableCell>{transaction.payment_method}</TableCell>
  </TableRow>
);

export default function PaymentsHistory() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const response = await lastTransactions(start, ITEMS_PER_PAGE);

        if (!response || response.error) {
          throw new Error(response?.error?.message || "Failed to fetch");
        }

        setTransactions(response.data);
        setHasMore(response.data.length === ITEMS_PER_PAGE);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [page]);
  if (error) return <div className="text-red-500 text-center">Error occurred: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TransactionRow key={t.transaction_id} transaction={t} />
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
