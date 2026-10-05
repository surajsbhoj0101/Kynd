import type { Response } from "express";

export interface ApiResponseData<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
  [key: string]: any;
}

export class ApiResponse {
  /**
   * Return a simplified standard success response.
   */
  static success<T = any>(
    res: Response,
    data?: T,
    message?: string,
    status = 200,
  ): Response {
    const body: ApiResponseData<T> = {
      success: true,
      ...(message && { message }),
      ...(data !== undefined && { data }),
    };
    console.log("Success Response:", body, "Status:", status);
    return res.status(status).json(body);
  }

  /**
   * Return a simplified standard error response.
   */
  static error(
    res: Response,
    error: string,
    status = 400,
    code?: string,
  ): Response {
    const body: ApiResponseData = {
      success: false,
      error,
      ...(code && { code }),
    };
    console.log("Error Response:", body, "Status:", status);
    return res.status(status).json(body);
  }

  /** 400 Bad Request */
  static badRequest(
    res: Response,
    error = "Bad Request",
    code?: string,
  ): Response {
    console.log("Bad Request:", error, code);
    return ApiResponse.error(res, error, 400, code);
  }

  /** 401 Unauthorized */
  static unauthorized(
    res: Response,
    error = "Unauthorized",
    code?: string,
  ): Response {
    console.log("Unauthorized:", error, code);
    return ApiResponse.error(res, error, 401, code);
  }

  /** 403 Forbidden */
  static forbidden(
    res: Response,
    error = "Forbidden",
    code?: string,
  ): Response {
    console.log("Forbidden:", error, code);
    return ApiResponse.error(res, error, 403, code);
  }

  /** 404 Not Found */
  static notFound(res: Response, error = "Not Found", code?: string): Response {
    console.log("Not Found:", error, code);
    return ApiResponse.error(res, error, 404, code);
  }

  /** 409 Conflict */
  static conflict(res: Response, error = "Conflict", code?: string): Response {
    console.log("Conflict:", error, code);
    return ApiResponse.error(res, error, 409, code);
  }

  /** 500 Internal Server Error */
  static serverError(
    res: Response,
    error = "Internal Server Error",
    code?: string,
  ): Response {
    console.log("Internal Server Error:", error, code);
    return ApiResponse.error(res, error, 500, code);
  }
}
