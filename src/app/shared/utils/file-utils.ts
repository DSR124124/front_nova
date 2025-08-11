// Utilidades para manejo de archivos
export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

export function isImageFile(filename: string): boolean {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
}

export function isPdfFile(filename: string): boolean {
  return /\.(pdf)$/i.test(filename);
}
