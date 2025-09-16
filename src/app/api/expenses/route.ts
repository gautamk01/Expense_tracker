import { NextResponse } from "next/server";
import db from "@/db";
import { expenses } from "@/db/schema";

export async function GET() {
    const allExpenses = await db.select().from(expenses);
    return NextResponse.json({ expenses: allExpenses });
}

export async function POST(request: Request) {
    const { title, amount } = await request.json();
    const newExpense = await db
        .insert(expenses)
        .values({ title, amount: String(amount) })
        .returning();

    return NextResponse.json({ expense: newExpense[0] });
}