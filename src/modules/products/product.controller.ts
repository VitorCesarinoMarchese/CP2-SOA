import { Request, Response } from 'express';
import { ProductService } from './product.service';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  listProducts = async (_req: Request, res: Response) => {
    const products = await this.productService.listProducts();
    return res.json({ data: products });
  };

  getProductById = async (req: Request, res: Response) => {
    const productId = Number(req.params.id);
    const product = await this.productService.getProduct(productId);
    return res.json({ data: product });
  };
}
