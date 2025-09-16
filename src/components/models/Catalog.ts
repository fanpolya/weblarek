import { IProduct } from '../../types';

export class Catalog {
  private products: IProduct[] = [];
  private selected: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelected(product: IProduct): void {
    this.selected = product;
  }

  getSelected(): IProduct | null {
    return this.selected;
  }
}