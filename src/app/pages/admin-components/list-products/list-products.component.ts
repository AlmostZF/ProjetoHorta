import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { StockService } from '../../../service/stock.service';
import { CreateProduct, CreateStock, InventoryMovement, Product, productType, UpdateProduct, UpdateStock } from '../../../models/product.model';
import { MessageModule } from 'primeng/message';
import { ProductService } from '../../../service/product.service';
import { CapitalizeFirstPipe } from "../../../pipe/capitalize-first.pipe";
import { ProductType } from "../../../pipe/product-type.pipe";

@Component({
  selector: 'app-list-products',
  imports: [
    TableModule,
    Dialog,
    SelectModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialog,
    InputTextModule,
    TextareaModule,
    CommonModule,
    FileUpload,
    Tag,
    RadioButton,
    InputTextModule,
    FormsModule,
    InputNumber,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    ReactiveFormsModule,
    MessageModule,
    CapitalizeFirstPipe,
    ProductType
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  loading:boolean = false;

  productType: productType[] = [
    {name: 'Verduras', value:0 },
    {name: 'Legumes', value:1 },
    {name: 'Fruta', value:2 },
    {name: 'Grao', value:3 },
    {name: 'Outro', value:4 },
  ];

  selectedProductType: number = 0;


  productDialog: boolean = false;

  products!: InventoryMovement[];
  SelectedProduct!: Product;
  product!: any;
  
  selectedProducts!: any[] | null;
  submitted: boolean = false;
  cols!: any[];
  exportColumns!: any[];
  
  @ViewChild('dt') dt!: Table;

  productForm: FormGroup;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private fb: FormBuilder,
    private stockService: StockService,
    private productService: ProductService
  ) { 
    this.productForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      productType:['', Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      quantity:[0, Validators.required],
    });

  }

  exportCSV(a: any):void {
    this.dt.exportCSV();
  }

  ngOnInit():void {
    this.getStock();
  }

  getStock():void{
    this.loading = true;
    this.stockService.getStock().subscribe({
      next:(result) =>{
        this.products = result;
        this.loading = false;
      },  
      error:(error) =>{
        this.loading = false;
      },
    })
  }

  getSeverity(quantity: number): string {
    if (quantity == 0) {
      return 'danger';
    }
    if (quantity > 0 && quantity < 5) {
      return 'warn';
    }
    return 'success';
  }

  getTitle(quantity: number): string {
    if (quantity == 0 ) {
      return 'Sem estoque';
    }
    if(quantity > 0 && quantity < 5){
      return 'Estoque acabando';
    }
    return 'Estoque cheio';
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nome',
      description: 'descrição',
      productType: 'Tipo',
      unitPrice: 'Valor',
      quantity: 'Quantidade',

    };
    return labels[fieldName] || fieldName;
  }

  getProductById(id: string):void{
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next:(result) =>{
        this.SelectedProduct = result;
        this.loading = false;
      },  
      error:(error) =>{
        this.loading = false;
      },
    })
  }

  private editStockPayload(form: FormGroup): UpdateStock{
    return {
      id: form.get('id')?.getRawValue(),
      quantity: form.get('quantity')?.getRawValue()
    }
  }

  updateStock(payload:UpdateStock):void{
    this.loading = true;
    this.stockService.updateStock(payload).subscribe({
      next:(result)=> {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Produto Atualizado',
        });
      },
      error:(error)=> {
        this.loading = false;
      }
    })
  }

  private editProductPayload(form: FormGroup): UpdateProduct{
    return {
      id: this.SelectedProduct.id,
      name: form.get('name')?.getRawValue(),
      productType: form.get('productType')?.getRawValue(),
      unitPrice: form.get('unitPrice')?.getRawValue(),
      sellerId: this.SelectedProduct.seller.id,
    }
  }

  updateProduct(payload: UpdateProduct):void{
    this.loading = true;
    this.productService.updateProduct(payload).subscribe({
      next:(result) =>{
        console.log(result)
        this.loading = false;
      },  
      error:(error) =>{
        this.loading = false;
      },
    })
  }

  private createProductPayload(form: FormGroup): CreateProduct{
    return {
      name: form.get('name')?.getRawValue(),
      productType: form.get('productType')?.getRawValue(),
      unitPrice: form.get('unitPrice')?.getRawValue(),
      sellerId: '80000ba9-8678-411a-8c23-d1e7e5e85c98',
    }
  }

  createProduct(payload: CreateProduct):void{
    let idProduct = '';
    this.loading = true;
    this.productService.createProduct(payload).subscribe({
      next:(result) =>{
        idProduct = result
        this.loading = false;
      },  
      error:(error) =>{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Erro ao criar produto',
          life: 3000
        });
        this.loading = false;
      },
      complete:() => {
        const creatStockPayload = this.createStockPayload(this.productForm, idProduct);
        this.createStock(creatStockPayload);
      },
    })
  }

  private createStockPayload(form: FormGroup, idProduct:string): CreateStock{
    return {
      productId: idProduct,
      quantity: form.get('quantity')?.getRawValue()
    }
  }

  createStock(payload: CreateStock):void{
    this.loading = true;
    this.stockService.createStock(payload).subscribe({
      next:(result) =>{
        this.loading = false;
      },  
      error:(error) =>{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Erro ao criar estoque',
          life: 3000
        });
        this.loading = false;
      },
      complete:() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Produto Criado',
          life: 3000
        });
      },
    })
  }


  saveProduct() :void{
    const payloadStock = this.editStockPayload(this.productForm);
    const payloadCreateProduct = this.createProductPayload(this.productForm)
    this.submitted = true;

    if (payloadStock.id) {
      const payloadProduct = this.editProductPayload(this.productForm)
      this.updateStock(payloadStock);
      this.updateProduct(payloadProduct);
      setTimeout(() => {
        this.getStock();
      }, 1000);
      this.productDialog = false;
      return;
    }

    this.createProduct(payloadCreateProduct);
      setTimeout(() => {
        this.getStock();
      }, 1000);
    this.productDialog = false;

  }

  openNew():void {
    this.productForm.reset();
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(stock: InventoryMovement):void {
    this.getProductById(stock.product.id);
    this.productForm.reset();
    this.productForm.patchValue({
      id: stock.id,
      name: stock.product.name,
      description: '',
      productType: stock.product.productType,
      unitPrice: stock.product.unitPrice, 
      quantity: stock.quantity
    })
    this.productDialog = true;
  }

  hideDialog():void {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteSelectedProducts():void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text'
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes'
      },
      accept: () => {
        this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000
        });
      }
    });
  }

  deleteProduct(product: any) :void{
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text'
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Yes'
      },
      accept: () => {
        this.products = this.products.filter((val) => val.id !== product.id);
        this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }


  
  navigateToHome(){
      this.router.navigate(['/admin'])
  }

}