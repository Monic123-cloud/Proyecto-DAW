import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { correo, auth_id } = body;

    if (!correo || !auth_id) {
      return NextResponse.json(
        { message: "Correo y auth_id son obligatorios." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usuario = await db.get(`SELECT * FROM usuario WHERE correo = ? AND auth_id = ?`, [correo, auth_id]);

    if (!usuario) {
      return NextResponse.json({ message: "Credenciales no válidas para usuario." }, { status: 401 });
    }

    return NextResponse.json({ message: "Acceso correcto.", usuario }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error al validar usuario.", detail: error.message }, { status: 500 });
  }
}
