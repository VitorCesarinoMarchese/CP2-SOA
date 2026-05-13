import { AppError } from './AppError';

export class PaymentRejectedError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 402, details);
  }
}
