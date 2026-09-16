import prisma from "@/lib/prisma";
import { getUser, isPrevileged } from "@/utils/authenticate";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const havePrivilege = await isPrevileged(request, "users:read");

  if (!havePrivilege) {
    return NextResponse.json(
      {
        message: "You do not have permission to access this resource",
      },
      {
        status: 403,
      },
    );
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      password: false,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      privileges: true,
    },
  });

  return NextResponse.json({
    message: "users fetched successfully",
    users: users,
  });
}



export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.email == null) {
    return NextResponse.json(
      {
        message: "Email is required",
      },
      {
        status: 400,
      },
    );
  }

  if (body.firstName == null) {
    return NextResponse.json(
      {
        message: "First name is required",
      },
      {
        status: 400,
      },
    );
  }

  if (body.lastName == null) {
    return NextResponse.json(
      {
        message: "Last name is required",
      },
      {
        status: 400,
      },
    );
  }

  if (body.password == null) {
    return NextResponse.json(
      {
        message: "Password is required",
      },
      {
        status: 400,
      },
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });

  if (existingUser != null) {
    return NextResponse.json(
      {
        message: "User with this email already exists",
      },
      {
        status: 409,
      },
    );
  }

  const passwordHash = await bcrypt.hash(body.password, 12)

  await prisma.user.create(
    {
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        password: passwordHash,
        phone: body.phone
      }
    }
  )

  return NextResponse.json(
    {
      message: "User created successfully"
    },
    {
      status: 201
    }
  )

}

export async function PUT(request: NextRequest) {

  const id = request.nextUrl.searchParams.get("id")

  const requestedUser = await getUser(request)

  if (requestedUser == null) {
    return NextResponse.json(
      {
        message: "You are not logged in"
      },
      {
        status: 401
      }
    )
  }

  if (requestedUser.id != id) {
    //
  } else {
    //
  }

}
