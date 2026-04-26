export const validarCP = (cp: string): boolean => {
  return /^\d{5}$/.test(cp);
};

export const validarDocumentoCompleto = (valor: string): boolean => {
  return /^[A-Za-z0-9]+$/.test(valor.trim());
};