import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
  timestamp: Date;
}

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  /**
   * Handle HTTP errors and convert them to AppError
   */
  handleError(error: HttpErrorResponse | Error): Observable<never> {
    let appError: AppError;

    if (error instanceof HttpErrorResponse) {
      appError = this.handleHttpError(error);
    } else {
      appError = this.handleGenericError(error);
    }

    // Log error (you can extend this to send to logging service)
    console.error('Error occurred:', appError);

    return throwError(() => appError);
  }

  /**
   * Handle HTTP error responses
   */
  private handleHttpError(error: HttpErrorResponse): AppError {
    const appError: AppError = {
      message: this.getErrorMessage(error),
      code: this.getErrorCode(error),
      statusCode: error.status,
      details: error.error,
      timestamp: new Date(),
    };

    return appError;
  }

  /**
   * Handle generic errors
   */
  private handleGenericError(error: Error): AppError {
    return {
      message: error.message || 'An unexpected error occurred',
      code: ErrorCode.UNKNOWN_ERROR,
      timestamp: new Date(),
    };
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    // Check if backend provided a message
    if (error.error?.message) {
      return error.error.message;
    }

    // Check if error has multiple messages (validation errors)
    if (error.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors.join(', ');
    }

    // Default messages based on status code
    switch (error.status) {
      case 0:
        return 'Network error. Please check your internet connection.';
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'You are not authorized. Please sign in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }

  /**
   * Get error code based on HTTP status
   */
  private getErrorCode(error: HttpErrorResponse): ErrorCode {
    switch (error.status) {
      case 0:
        return ErrorCode.NETWORK_ERROR;
      case 401:
        return ErrorCode.UNAUTHORIZED;
      case 403:
        return ErrorCode.FORBIDDEN;
      case 404:
        return ErrorCode.NOT_FOUND;
      case 422:
        return ErrorCode.VALIDATION_ERROR;
      case 500:
      case 502:
      case 503:
        return ErrorCode.SERVER_ERROR;
      default:
        return ErrorCode.UNKNOWN_ERROR;
    }
  }

  /**
   * Check if error is a specific type
   */
  isErrorType(error: AppError, code: ErrorCode): boolean {
    return error.code === code;
  }

  /**
   * Get validation errors from error response
   */
  getValidationErrors(error: AppError): Record<string, string[]> {
    if (this.isErrorType(error, ErrorCode.VALIDATION_ERROR) && error.details?.errors) {
      return error.details.errors;
    }
    return {};
  }
}
