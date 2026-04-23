import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      nombre_comercio,
      categoria,
      telefono,
      correo,
      direccion,
      numero,
      municipio,
      provincia,
      cp,
      latitud,
      longitud,
      url_web,
    } = body;

    if (!nombre_comercio) {
      return NextResponse.json({ message: "El nombre del comercio es obligatorio." }, { status: 400 });
    }

    const db = await getDb();

    if (correo) {
      const existing = await db.get(`SELECT id_establecimiento FROM establecimiento WHERE correo = ?`, [correo]);
      if (existing) {
        return NextResponse.json({ message: "Ya existe un comercio registrado con ese correo." }, { status: 409 });
      }
    }

    const result = await db.run(
      `INSERT INTO establecimiento (
        nombre_comercio, categoria, telefono, correo, direccion,
        numero, municipio, provincia, cp, latitud, longitud, url_web
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_comercio,
        categoria || null,
        telefono || null,
        correo || null,
        direccion || null,
        numero || null,
        municipio || null,
        provincia || null,
        cp || null,
        latitud || null,
        longitud || null,
        url_web || null,
      ]
    );

    return NextResponse.json({ message: "Comercio creado correctamente.", id_establecimiento: result.lastID }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error al registrar comercio.", detail: error.message }, { status: 500 });
  }
}
