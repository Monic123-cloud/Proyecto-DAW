/**
 * Incluye validación legal de NIF, NIE, CIF y Código Postal (España)
 */

/**
 * Valida un documento de identidad español (NIF, NIE o CIF)
 * @param identificador El string a validar
 * @returns boolean
 */
export const validarDocumentoCompleto = (identificador: string): boolean => {
  if (!identificador) return false;
  const doc = identificador.trim().toUpperCase();

  // 1. Validar NIF (Autónomos y Particulares Españoles: 8 números + 1 letra)
  if (/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/.test(doc)) {
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = parseInt(doc.substring(0, 8), 10);
    return letras[numero % 23] === doc[8];
  }

  // 2. Validar NIE (Autónomos Extranjeros: X/Y/Z + 7 números + 1 letra)
  if (/^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/.test(doc)) {
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    // Reemplazamos X por 0, Y por 1 y Z por 2 para el cálculo
    const prefijo = doc[0].replace('X', '0').replace('Y', '1').replace('Z', '2');
    const numeroNIE = parseInt(prefijo + doc.substring(1, 8), 10);
    return letras[numeroNIE % 23] === doc[8];
  }

  // 3. Validar CIF (Sociedades y Empresas: 1 letra + 7 números + 1 dígito de control)
  if (/^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/.test(doc)) {
    const digitos = doc.substring(1, 8);
    let sumaPares = 0;
    let sumaImpares = 0;

    for (let i = 0; i < digitos.length; i++) {
      const n = parseInt(digitos[i], 10);
      if (i % 2 !== 0) {
        // Posiciones pares (índice 1, 3, 5...)
        sumaPares += n;
      } else {
        // Posiciones impares (índice 0, 2, 4, 6...): se multiplica x2 y se suman sus dígitos
        let n2 = n * 2;
        sumaImpares += (n2 > 9 ? n2 - 9 : n2);
      }
    }

    const total = sumaPares + sumaImpares;
    const unidad = total % 10;
    const digitoControl = unidad === 0 ? 0 : 10 - unidad;
    const letrasCIF = "JABCDEFGHI";

    // El último caracter puede ser número o letra según el tipo de sociedad
    return doc[8] === digitoControl.toString() || doc[8] === letrasCIF[digitoControl];
  }

  return false;
};

/**
 * Valida un Código Postal español
 * - 5 dígitos exactos
 * - Los dos primeros dígitos deben estar entre 01 y 52 (provincias de España)
 * @param cp El string del código postal
 * @returns boolean
 */
export const validarCP = (cp: string): boolean => {
  return /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(cp.trim());
};