import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take } from "rxjs";
import { environment } from "../../environment";
import { Product, CreateProduct, UpdateProduct, ProductFitered, Filter } from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = environment.baseUrl;

  constructor( private http: HttpClient) {
  }

  getProduct(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.baseUrl}/Product`).pipe(take(1))
  }

  getProductById(id:string): Observable<Product>{
    return this.http.get<Product>(`${this.baseUrl}/Product/${id}`).pipe(take(1))
  }
  
  deleteProductById(id:string): Observable<Product>{
    return this.http.delete<Product>(`${this.baseUrl}/Product/${id}`).pipe(take(1))
  }
  
  ChangeStatus(id:string, status: boolean): Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/Product/status`, {id: id, isActive: status}).pipe(take(1))
  }

  createProduct(createProduct: CreateProduct): Observable<string>{
    const formdata = this.mountFormData(createProduct);
    return this.http.post<string>(`${this.baseUrl}/Product`, formdata).pipe(take(1))
  }

  updateProduct(updateProduct: UpdateProduct): Observable<Product>{
    const formdata = this.mountFormData(updateProduct);
    return this.http.put<Product>(`${this.baseUrl}/Product`, formdata).pipe(take(1))
  }
  
  getProductFilter(filterField: Filter): Observable<ProductFitered>{
    const params = this.mountParamsFilter(filterField);
    const url = `${this.baseUrl}/Product/filter`;
    const urlWithParams = `${url}?${params.toString()}`;

    return this.http.get<ProductFitered>(urlWithParams).pipe(take(1))
  }

  private mountFormData(product: any): FormData {
      console.log(product)
      const formData = new FormData();
        formData.append('Name', product.name);
        formData.append('ProductType', JSON.stringify(product.productType));
        formData.append('UnitPrice', JSON.stringify(product.unitPrice));
        formData.append('ConservationDays', product.conservationDays);
        formData.append('LargeDescription', product.largeDescription);
        formData.append('ShortDescription', product.shortDescription);
        formData.append('Weight', product.weight);
        
        if (product.image.name) {
          formData.append('Image', product.image, product.image.name);
        }

        if(product.id){
          formData.append('Id', product.id);
        }

      return formData;
  }

  private mountParamsFilter(filterField: Filter): string {

    const params = new URLSearchParams();

    const fieldMaps: Record<keyof Filter, string> = {
      MaxItensPerPage: 'MaxItensPerPage',
      PageNumber: 'PageNumber',
      name: 'Name',
      seller: 'Seller',
      productType: 'Category',
    }

    for(const [key, paramName] of Object.entries(fieldMaps)) {
      const value = (filterField as any)[key];
      if(value !== undefined && value !== null) {
        params.set(paramName, value.toString());
      }
    }
    
    return params.toString();
  }

}