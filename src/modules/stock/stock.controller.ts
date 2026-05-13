import { Request, Response } from 'express';
import { StockService } from './stock.service';

export class StockController {
  constructor(private readonly stockService: StockService) {}

  getStockByProductId = async (req: Request, res: Response) => {
    const productId = Number(req.params.productId);
    const available = await this.stockService.getAvailableQuantity(productId);
    return res.json({ data: { productId, available } });
  };
}
