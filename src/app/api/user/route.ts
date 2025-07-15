import { turso } from "@/lib/tursoclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await turso.execute("SELECT * FROM users");
    return NextResponse.json({
      users: users,
    });
  } catch (error: unknown) {
    let errorMessage = "An error occurred while fetching users.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await turso.execute(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE)"
    );
    const body = await request.json();

    // Validate input
    if (
      !body ||
      typeof body.name !== "string" ||
      typeof body.email !== "string"
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid input. 'name' and 'email' are required and must be strings.",
        },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const email = body.email.trim();

    if (!name || !email) {
      return NextResponse.json(
        {
          message: "Both 'name' and 'email' fields are required.",
        },
        { status: 400 }
      );
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: "Invalid email format.",
        },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existing = await turso.execute({
      sql: "SELECT id FROM users WHERE email = :email",
      args: { email },
    });
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        {
          message: "A user with this email already exists.",
        },
        { status: 409 }
      );
    }

    const result = await turso.execute({
      sql: "INSERT INTO users (name, email) VALUES (:name, :email)",
      args: { name, email },
    });

    return NextResponse.json(
      {
        message: "User created successfully!",
        user: {
          name,
          email,
          id:
            result?.lastInsertRowid !== undefined &&
            result?.lastInsertRowid !== null
              ? Number(result.lastInsertRowid)
              : null,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    let errorMessage = "An error occurred while creating the user.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (typeof id !== "number" || isNaN(id)) {
      return NextResponse.json(
        {
          message: "Invalid input. 'id' is required and must be a number.",
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await turso.execute({
      sql: "SELECT id FROM users WHERE id = :id",
      args: { id },
    });

    const rows = Array.isArray(existing?.rows)
      ? existing.rows
      : Array.isArray(existing)
      ? existing
      : [];
    if (rows.length === 0) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    await turso.execute({
      sql: "DELETE FROM users WHERE id = :id",
      args: { id },
    });

    return NextResponse.json(
      {
        message: "User deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    let errorMessage = "An error occurred while deleting the user.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
