export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export type ErrorType = ApiError | Error | unknown;

export function getErrorMessage(error: ErrorType): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    if ('message' in error) {
      return (error as ApiError).message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return 'Неизвестная ошибка';
    }
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Произошла неизвестная ошибка';
}