import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { expenses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        const { title, amount, date } = await request.json();
        const updatedExpense = await db
            .update(expenses)
            .set({ title, amount: String(amount), date: new Date(date) })
            .where(eq(expenses.id, parseInt(id)))
            .returning();

        return NextResponse.json({ expense: updatedExpense[0] });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        const { id } = await params;
        await db.delete(expenses).where(eq(expenses.id, parseInt(id)));

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}