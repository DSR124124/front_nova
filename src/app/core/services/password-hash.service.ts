import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordHashService {

  constructor() { }

  /**
   * Genera un salt aleatorio para el hasheo de contraseñas
   */
  private generateSalt(length: number = 16): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hashea una contraseña usando PBKDF2 (Password-Based Key Derivation Function 2)
   * Esta es una función segura para el hasheo de contraseñas
   */
  async hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const generatedSalt = salt || this.generateSalt();
    
    // Convertir la contraseña y salt a ArrayBuffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(generatedSalt);

    // Importar la clave para PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    // Derivar la clave usando PBKDF2
    const derivedKey = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 100000, // Número de iteraciones (más = más seguro pero más lento)
        hash: 'SHA-256'
      },
      keyMaterial,
      256 // 256 bits = 32 bytes
    );

    // Convertir el resultado a string hexadecimal
    const hashArray = Array.from(new Uint8Array(derivedKey));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return {
      hash: hash,
      salt: generatedSalt
    };
  }

  /**
   * Verifica si una contraseña coincide con su hash
   */
  async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    try {
      const result = await this.hashPassword(password, salt);
      return result.hash === hash;
    } catch (error) {
      console.error('Error verificando contraseña:', error);
      return false;
    }
  }

  /**
   * Genera una contraseña aleatoria segura
   */
  generateSecurePassword(length: number = 12): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Asegurar que la contraseña tenga al menos un carácter de cada tipo
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Mayúscula
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Minúscula
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Número
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Símbolo

    // Completar el resto de la contraseña
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Mezclar los caracteres para mayor seguridad
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Valida la fortaleza de una contraseña
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Longitud mínima
    if (password.length < 8) {
      feedback.push('La contraseña debe tener al menos 8 caracteres');
    } else if (password.length >= 12) {
      score += 2;
    } else {
      score += 1;
    }

    // Caracteres en mayúscula
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Incluye al menos una letra mayúscula');
    }

    // Caracteres en minúscula
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Incluye al menos una letra minúscula');
    }

    // Números
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Incluye al menos un número');
    }

    // Símbolos especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Incluye al menos un símbolo especial');
    }

    // Verificar que no sea una contraseña común
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'user'];
    if (commonPasswords.includes(password.toLowerCase())) {
      score -= 2;
      feedback.push('Evita usar contraseñas comunes');
    }

    // Verificar que no tenga caracteres repetidos consecutivos
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      feedback.push('Evita caracteres repetidos consecutivos');
    }

    const isValid = score >= 3 && password.length >= 8;

    return {
      isValid,
      score: Math.max(0, Math.min(5, score)),
      feedback
    };
  }

  /**
   * Obtiene el nivel de fortaleza de la contraseña
   */
  getPasswordStrengthLevel(score: number): string {
    if (score <= 1) return 'Muy Débil';
    if (score <= 2) return 'Débil';
    if (score <= 3) return 'Moderada';
    if (score <= 4) return 'Fuerte';
    return 'Muy Fuerte';
  }
}
