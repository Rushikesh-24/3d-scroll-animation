import { turso } from "@/lib/tursoclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const users = await turso.execute("SELECT * FROM users");
    return NextResponse.json({
        users: users,
    });
}

export async function POST(request: NextRequest) {
    await turso.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE)");
    const {name, email} = await request.json();
    const result = await turso.execute({
        sql: "INSERT INTO users (name, email) VALUES (:name, :email)",
        args: { name, email },
    });
    return NextResponse.json({
        message: "User created successfully!",
        user: {
            result: result,
            name: name,
            email: email,  
        }});
}