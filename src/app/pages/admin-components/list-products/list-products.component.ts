import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG Módulos e Componentes
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { CascadeSelectModule } from 'primeng/cascadeselect';

// Serviços
import { StockService } from '../../../service/stock.service';
import { ProductService } from '../../../service/product.service';

// Modelos
import {
  CreateProduct,
  CreateStock,
  InventoryMovement,
  Product,
  productType,
  productTypesList,
  UpdateProduct,
  UpdateStock
} from '../../../models/product.model';

// Pipes
import { CapitalizeFirstPipe } from '../../../pipe/capitalize-first.pipe';
import { ProductType } from '../../../pipe/product-type.pipe';



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
    ProductType,
    CascadeSelectModule
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  // Estado e controle
  loading: boolean = false;
  submitted: boolean = false;
  productDialog: boolean = false;

  // Formulário
  productForm!: FormGroup;

  // Tipos e seleções
  productType: productType[] = productTypesList;
  selectedProductType: number = 0;
  selectedProducts!: Product[] | null;
  selectedCity: any;

  // Dados e entidades
  products!: InventoryMovement[];
  product!: Product | null;
  selectedProduct!: Product;

  // Colunas e exportação
  cols!: any[];
  exportColumns!: any[];

  // Opções de unidades de peso
  weights: { name: string; value: string }[] = [
    { name: 'kg', value: 'kg' },
    { name: 'g', value: 'g' },
    { name: 'mg', value: 'mg' },
    { name: 'L', value: 'L' }
  ];

  // Outras listas
  cities: any[] = [];

  // Referências de template
  @ViewChild('dt') dt!: Table;


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
      shortDescription: ['', Validators.required],
      largeDescription: ['', Validators.required],
      productType:['', Validators.required],
      conservationDays:['', Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      quantity:[0, Validators.required],
      weight:['', Validators.required],
    });

  }

  exportCSV(a: any):void {
    this.dt.exportCSV();
  }


  ngOnInit():void {
    this.getStock();
            this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
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
      largeDescription: 'descrição',
      shortDescription: 'descrição',
      productType: 'Tipo',
      unitPrice: 'Valor',
      quantity: 'Quantidade',
      conservationDays: 'Conservação',
      weight: 'Peso',

    };
    return labels[fieldName] || fieldName;
  }

  getProductById(id: string):void{
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next:(result) =>{
        this.selectedProduct = result;
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
      id: this.selectedProduct.id,
      name: form.get('name')?.getRawValue(),
      productType: form.get('productType')?.getRawValue(),
      unitPrice: form.get('unitPrice')?.getRawValue(),
      conservationDays: form.get('conservationDays')?.getRawValue(),
      image: 'https://static.vecteezy.com/system/resources/previews/015/100/096/original/bananas-transparent-background-free-png.png',
      shortDescription: form.get('shortDescription')?.getRawValue(),
      largeDescription: form.get('largeDescription')?.getRawValue(),
      weight: form.get('weight')?.getRawValue().toString(),
      sellerId: this.selectedProduct.seller.id,
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
      complete:() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Produto Atualizado',
          life: 3000
        });
      }
    })
  }

  private createProductPayload(form: FormGroup): CreateProduct{
    return {
      name: form.get('name')?.getRawValue(),
      productType: form.get('productType')?.getRawValue(),
      unitPrice: form.get('unitPrice')?.getRawValue(),
      sellerId: 'b23e1364-9d16-4f4c-bbfe-1c3f426ef4e4',
      conservationDays: form.get('conservationDays')?.getRawValue(),
      image: 'https://static.vecteezy.com/system/resources/previews/015/100/096/original/bananas-transparent-background-free-png.png',
      shortDescription: form.get('shortDescription')?.getRawValue(),
      largeDescription: form.get('largeDescription')?.getRawValue(),
      weight: form.get('weight')?.getRawValue().toString(),
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
        this.getStock();
      },
    })
  }


    saveProduct(): void {
    const payloadStock = this.editStockPayload(this.productForm);
    const payloadCreateProduct = this.createProductPayload(this.productForm)
    this.submitted = true;

    if (payloadStock.id) {
      const payloadProduct = this.editProductPayload(this.productForm)
      this.promiseUpdateStock(payloadStock, payloadProduct);

      this.productDialog = false;
      return;
    }

    this.createProduct(payloadCreateProduct);
    this.productDialog = false;

  }

  private async promiseUpdateStock(payloadStock:UpdateStock, payloadProduct:UpdateProduct): Promise<void> {
    await Promise.all([
      this.updateStock(payloadStock),
      this.updateProduct(payloadProduct),
    ])
    .then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Produto Atualizado',
        life: 3000
      });

      this.getStock();
    })
    .catch((error) => {
        console.error("Erro ao atualizar estoque e produto", error);
    });
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
      quantity: stock.quantity,
      conservationDays: stock.product.conservationDays,
      image: stock.product.image,
      shortDescription: stock.product.shortDescription,
      largeDescription: stock.product.largeDescription,
      weight:stock.product.weight ,
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
        // this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
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
        this.product = null;
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