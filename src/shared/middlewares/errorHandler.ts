import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      details: error.details ?? null,
    });
  }

  console.error(error);
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Unexpected server error',
  });
};
