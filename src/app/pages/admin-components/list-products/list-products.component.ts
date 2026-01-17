import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG Módulos e Componentes
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';

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
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";



@Component({
  selector: 'app-list-products',
  imports: [
    TableModule,
    Dialog,
    SelectModule,
    ToastModule,
    ToolbarModule,
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
    CascadeSelectModule,
    RouterModule,
    ToggleSwitchModule
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
  checked: boolean = false;
  isSidebarVisible: boolean = false;

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
    { name: 'kg (Kilograma)', value: 'kg' },
    { name: 'g (grama)', value: 'g' },
    { name: 'mg (miligrama)', value: 'mg' },
    { name: 'L (litro)', value: 'L' }
  ];

  // Outras listas
  conservationDescription: { name: string; value: string }[] = [
    { name: 'Dentro da geladeira', value: 'geladeira' },
    { name: 'Fora da geladeira', value: 'fora' },
    { name: 'Em temperatura ambiente', value: 'ambiente' }
  ];


  // Referências de template
  @ViewChild('dt') dt!: Table;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private fb: FormBuilder,
    private stockService: StockService,
    private productService: ProductService
  ) {
    this.createform();
  }

  exportCSV(a: any): void {
    this.dt.exportCSV();
  }

  ngOnInit(): void {
    this.getStock();
  }

  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }

  base64String: string = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
        const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;
        this.base64String = base64;
        console.log('Base64 gerado:', base64);
      };

      reader.onerror = (error) => {
        console.error('Erro ao ler o arquivo:', error);
      };

      reader.readAsDataURL(file);
    }
  }

  createform(): void {
    this.productForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      shortDescription: [null, Validators.required],
      largeDescription: [null, Validators.required],
      productType: [null, Validators.required],
      conservationDays: [null, Validators.required],
      conservationDescription: [null, Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, Validators.required],
      weight: [null, Validators.required],
    });
  }

  getStock(): void {
    this.loading = true;
    this.stockService.getStock().subscribe({
      next: (result) => {
        this.products = result;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
    })
  }


  getProductById(id: string): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (result) => {
        this.selectedProduct = result;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
    })
  }

  updateStock(payload: UpdateStock): void {
    this.loading = true;
    this.stockService.updateStock(payload).subscribe({
      next: (result) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Produto Atualizado',
        });
      },
      error: (error) => {
        this.loading = false;
      }
    })
  }

  updateProduct(payload: UpdateProduct): void {
    this.loading = true;
    this.productService.updateProduct(payload).subscribe({
      next: (result) => {
        console.log(result)
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Produto Atualizado',
          life: 3000
        });
      }
    })
  }

  createProduct(payload: CreateProduct): void {
    let idProduct = '';
    this.loading = true;
    this.productService.createProduct(payload).subscribe({
      next: (result) => {
        idProduct = result
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Erro ao criar produto',
          life: 3000
        });
        this.loading = false;
      },
      complete: () => {
        const creatStockPayload = this.createStockPayload(this.productForm, idProduct);
        this.createStock(creatStockPayload);

      },
    })
  }

  createStock(payload: CreateStock): void {
    this.loading = true;
    this.stockService.createStock(payload).subscribe({
      next: (result) => {
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Erro ao criar estoque',
          life: 3000
        });
        this.loading = false;
      },
      complete: () => {
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


  openNew(): void {
    this.productForm.reset();
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(stock: InventoryMovement): void {
    this.getProductById(stock.product.id);
    this.productForm.reset();

    const conservationDaysOnly = parseInt(stock.product.conservationDays.split('dias')[0], 10);
    this.productForm.patchValue({
      id: stock.id,
      name: stock.product.name,
      description: '',
      productType: stock.product.productType,
      unitPrice: stock.product.unitPrice,
      quantity: stock.quantity,
      conservationDays: conservationDaysOnly,
      image: stock.product.image,
      shortDescription: stock.product.shortDescription,
      largeDescription: stock.product.largeDescription,
      weight: stock.product.weight,
    })
    this.productDialog = true;
  }

  hideDialog(): void {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteSelectedProducts(): void {
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

  deleteProduct(product: any): void {
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


  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
    }
    return '';
  }

    validateProduct(): void {

    this.productForm.markAllAsTouched();
    this.productForm.updateValueAndValidity();

    console.log(this.productForm.valid)

    if (!this.productForm.valid) {
      return;
    }

    this.saveProduct();
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nome',
      largeDescription: 'descrição',
      shortDescription: 'descrição',
      productType: 'Categoria',
      unitPrice: 'Preço',
      quantity: 'Quantidade',
      conservationDays: 'Conservação',
      conservationDescription: 'Tipo de conservação',
      weight: 'Peso',

    };
    return labels[fieldName] || fieldName;
  }

  private editProductPayload(form: FormGroup): UpdateProduct {
    return {
      id: this.selectedProduct.id,
      name: form.get('name')?.getRawValue(),
      productType: form.get('productType')?.getRawValue(),
      unitPrice: form.get('unitPrice')?.getRawValue(),
      conservationDays: `${form.get('conservationDays')?.getRawValue()} dias ${form.get('conservationDescription')?.getRawValue()?.name ?? ''}`,
      image: this.base64String,
      shortDescription: form.get('shortDescription')?.getRawValue(),
      largeDescription: form.get('largeDescription')?.getRawValue(),
      weight: form.get('weight')?.getRawValue().value,
      sellerId: this.selectedProduct.seller.id,
    }
  }

  private createProductPayload(form: FormGroup): CreateProduct {
    return {
      name: form.get('name')?.getRawValue(),
      productType: form.get('productType')?.getRawValue(),
      unitPrice: form.get('unitPrice')?.getRawValue(),
      sellerId: "08de48f4-15f1-4562-8cc9-5e3cec885f76",
      conservationDays: `${form.get('conservationDays')?.getRawValue()} dias ${form.get('conservationDescription')?.getRawValue()?.name ?? ''}`,
      image: this.base64String,
      shortDescription: form.get('shortDescription')?.getRawValue(),
      largeDescription: form.get('largeDescription')?.getRawValue(),
      weight: form.get('weight')?.getRawValue().value,
    }
  }

  private editStockPayload(form: FormGroup): UpdateStock {
    return {
      id: form.get('id')?.getRawValue(),
      quantity: form.get('quantity')?.getRawValue()
    }
  }

  private createStockPayload(form: FormGroup, idProduct: string): CreateStock {
    return {
      productId: idProduct,
      quantity: form.get('quantity')?.getRawValue()
    }
  }

  private async promiseUpdateStock(payloadStock: UpdateStock, payloadProduct: UpdateProduct): Promise<void> {
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


  isInvalid(controlName: string) {
    const control = this.productForm.get(controlName);
    return control?.invalid && (control.touched);
  }

  getSeverity(quantity: number): 'success' | 'info' | 'warn' | 'danger' {
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


  navigateToHome() {
    this.router.navigate(['/admin'])
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

}