export type ServiceResponse<T> = 
  | { status: "ok"; data: T; code: number }
  | { status: "error"; message: string; code: number };

export class ServiceError extends Error {
  code: number;
  constructor(message: string, code: number = 500) {
    super(message);
    this.code = code;
    this.name = 'ServiceError';
  }

  static NotFound(message: string = "Resource not found") {
    return new ServiceError(message, 404);
  }

  static Unauthorized(message: string = "Unauthorized") {
    return new ServiceError(message, 401);
  }

  static BadRequest(message: string = "Bad request") {
    return new ServiceError(message, 400);
  }

  static Conflict(message: string = "Resource already exists") {
    return new ServiceError(message, 409);
  }

  static Internal(message: string = "Internal server error") {
    return new ServiceError(message, 500);
  }
}

export async function handleServiceOp<T>(
  op: () => Promise<T>,
  defaultErrorMessage: string = "Operation failed",
  successCode: number = 200
): Promise<ServiceResponse<T>> {
  try {
    const data = await op();
    return { status: "ok", data, code: successCode };
  } catch (error) {
    if (error instanceof ServiceError) {
      return { status: "error", message: error.message, code: error.code };
    }
    
    console.error(`Service Operation Error: ${defaultErrorMessage}`, error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('UNIQUE constraint failed')) {
      return { status: "error", message: "Record already exists", code: 409 };
    }

    return { status: "error", message: defaultErrorMessage, code: 500 };
  }
}
