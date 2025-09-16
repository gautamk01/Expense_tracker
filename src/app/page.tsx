"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ExpenseForm } from "@/components/expense-form";
import { Input } from "@/components/ui/input";
import { RecruiterEnvelope } from "@/components/recruiter-envelope";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { expenses } from "@/db/schema";
import { format } from "date-fns";
import Loading from "@/components/ui/loading";

type Expense = typeof expenses.$inferSelect;

export default function Home() {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [isRecruiterEnvelopeOpen, setIsRecruiterEnvelopeOpen] = useState(false);

  async function fetchExpenses() {
    setLoading(true);
    const res = await fetch("/api/expenses");
    const { expenses } = await res.json();
    setData(expenses);
    setLoading(false);
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const filteredData = data
    .filter((expense) =>
      expense.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((expense) => {
      if (dateRange === "all") {
        return true;
      }
      const days = parseInt(dateRange);
      const date = new Date(expense.date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days;
    });

  return (
    <main className="container mx-auto py-12">
      <div className="text-center mb-8">
        <Button
          onClick={() => setIsRecruiterEnvelopeOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Message for Recruiter
        </Button>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingExpense(null);
                setIsDialogOpen(true);
              }}
            >
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingExpense ? "Edit Expense" : "Add Expense"}
              </DialogTitle>
            </DialogHeader>
            <ExpenseForm
              expense={editingExpense}
              onSuccess={() => {
                fetchExpenses();
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center mb-8">
        <Input
          placeholder="Search by title..."
          className="max-w-sm mr-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ₹
            {filteredData.reduce(
              (acc, expense) => acc + parseFloat(expense.amount),
              0
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{format(new Date(expense.date), "PPP")}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setEditingExpense(expense);
                        setIsDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this expense?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              await fetch(`/api/expenses/${expense.id}`, {
                                method: "DELETE",
                              });
                              fetchExpenses();
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <RecruiterEnvelope
        isOpen={isRecruiterEnvelopeOpen}
        onClose={() => setIsRecruiterEnvelopeOpen(false)}
      />
    </main>
  );
}
