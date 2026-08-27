export class Validator {
  static validateFullName(value: string): string {
    if (!value || value.trim().length === 0) return 'Full name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  }

  static validateEmail(value: string): string {
    if (!value || value.trim().length === 0) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Enter a valid email address';
    return '';
  }

  static validatePassword(value: string): string {
    if (!value || value.length === 0) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  }

  static validateNotEmpty(value: string, fieldName: string = 'Field'): string {
    if (!value || value.trim().length === 0) return `${fieldName} is required`;
    return '';
  }

  static validatePositiveInt(value: number, fieldName: string = 'Value'): string {
    if (!value || value <= 0) return `${fieldName} must be a positive number`;
    return '';
  }

  static validateUrl(value: string): string {
    if (!value || value.trim().length === 0) return '';
    try {
      new URL(value);
      return '';
    } catch {
      return 'Enter a valid URL (e.g. https://github.com/username)';
    }
  }
}
