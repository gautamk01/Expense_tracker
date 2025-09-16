import { NextResponse } from "next/server";
import db from "@/db";
import { expenses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { title, amount, date } = await request.json();
    const updatedExpense = await db
        .update(expenses)
        .set({ title, amount: String(amount), date: new Date(date) })
        .where(eq(expenses.id, parseInt(params.id)))
        .returning();

    return NextResponse.json({ expense: updatedExpense[0] });
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    await db.delete(expenses).where(eq(expenses.id, parseInt(params.id)));

    return new Response(null, { status: 204 });
}