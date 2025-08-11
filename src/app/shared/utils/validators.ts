// Validadores custom para formularios Angular
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailRegex.test(value) ? null : { email: true };
  };
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    // Al menos 6 caracteres, una mayúscula, una minúscula y un número
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return strong.test(value) ? null : { passwordStrength: true };
  };
}
