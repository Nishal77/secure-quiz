// Validation utilities
export function validateUSN(usn: string): { valid: boolean; error?: string } {
  if (!usn || usn.trim().length === 0) {
    return { valid: false, error: 'USN is required' };
  }

  if (usn.trim().length < 3) {
    return { valid: false, error: 'USN must be at least 3 characters' };
  }

  if (usn.trim().length > 50) {
    return { valid: false, error: 'USN must be less than 50 characters' };
  }

  return { valid: true };
}

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.trim().length > 255) {
    return { valid: false, error: 'Name must be less than 255 characters' };
  }

  // Basic name validation (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return { valid: false, error: 'Name contains invalid characters' };
  }

  return { valid: true };
}

export function validateAnswer(answer: string | null): boolean {
  if (!answer) return true; // Empty answer is valid (not answered yet)
  return ['A', 'B', 'C', 'D'].includes(answer.toUpperCase());
}

