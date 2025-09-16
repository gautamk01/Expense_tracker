"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { expenses } from "@/db/schema";

type Expense = typeof expenses.$inferSelect;

export function ExpensesChart({ data }: { data: Expense[] }) {
  const chartData = data.map((expense) => ({
    ...expense,
    amount: parseFloat(expense.amount),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="title"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="amount" fill="var(--color-primary)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
