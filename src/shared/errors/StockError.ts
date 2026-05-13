import { AppError } from './AppError';

export class StockError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, details);
  }
}
