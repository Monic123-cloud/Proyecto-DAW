import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "El login de comercio no está operativo todavía porque la tabla establecimiento no tiene auth_id ni password_hash. Añade una credencial propia al esquema antes de validarlo.",
    },
    { status: 400 }
  );
}
