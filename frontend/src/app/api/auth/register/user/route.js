import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nombre,
      apellidos,
      correo,
      auth_id,
      sexo,
      fecha_nacimiento,
      telefono,
      direccion,
      numero,
      piso,
      letra,
      municipio,
      provincia,
      cp,
      latitud,
      longitud,
    } = body;

    if (!nombre || !apellidos || !correo || !auth_id) {
      return NextResponse.json(
        { message: "Nombre, apellidos, correo y auth_id son obligatorios." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const existing = await db.get(`SELECT id_usuario FROM usuario WHERE correo = ? OR auth_id = ?`, [correo, auth_id]);

    if (existing) {
      return NextResponse.json(
        { message: "Ya existe un usuario registrado con ese correo o auth_id." },
        { status: 409 }
      );
    }

    const result = await db.run(
      `INSERT INTO usuario (
        nombre, apellidos, correo, auth_id, sexo, fecha_nacimiento,
        telefono, direccion, numero, piso, letra, municipio,
        provincia, cp, latitud, longitud
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellidos,
        correo,
        auth_id,
        sexo || null,
        fecha_nacimiento || null,
        telefono || null,
        direccion || null,
        numero || null,
        piso || null,
        letra || null,
        municipio || null,
        provincia || null,
        cp || null,
        latitud || null,
        longitud || null,
      ]
    );

    return NextResponse.json({ message: "Usuario creado correctamente.", id_usuario: result.lastID }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error al registrar usuario.", detail: error.message }, { status: 500 });
  }
}
