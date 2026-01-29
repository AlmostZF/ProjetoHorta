import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// primeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { SelectModule } from 'primeng/select';
import { SellerService } from '../../../service/seller.service';
import { PickupLocation, Seller } from '../../../models/seller.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LoadingService } from '../../../service/loading.service';


@Component({
    selector: 'app-seller',
    imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    MessageModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CommonModule,
    InputOtpModule,
    RouterModule,
    SelectModule,
    SelectButtonModule
],
    templateUrl: './seller.component.html',
    styleUrl: './seller.component.scss'
})
export class SellerComponent implements OnInit {
    value: any;
    data: any;
    seller: Seller | null = null;
    sellerForm!: FormGroup;
    states: any[] = [
        { label: 'Acre', value: 'AC' },
        { label: 'Alagoas', value: 'AL' },
        { label: 'Amapá', value: 'AP' },
        { label: 'Amazonas', value: 'AM' },
        { label: 'Bahia', value: 'BA' },
        { label: 'Ceará', value: 'CE' },
        { label: 'Distrito Federal', value: 'DF' },
        { label: 'Espírito Santo', value: 'ES' },
        { label: 'Goiás', value: 'GO' },
        { label: 'Maranhão', value: 'MA' },
        { label: 'Mato Grosso', value: 'MT' },
        { label: 'Mato Grosso do Sul', value: 'MS' },
        { label: 'Minas Gerais', value: 'MG' },
        { label: 'Pará', value: 'PA' },
        { label: 'Paraíba', value: 'PB' },
        { label: 'Paraná', value: 'PR' },
        { label: 'Pernambuco', value: 'PE' },
        { label: 'Piauí', value: 'PI' },
        { label: 'Rio de Janeiro', value: 'RJ' },
        { label: 'Rio Grande do Norte', value: 'RN' },
        { label: 'Rio Grande do Sul', value: 'RS' },
        { label: 'Rondônia', value: 'RO' },
        { label: 'Roraima', value: 'RR' },
        { label: 'Santa Catarina', value: 'SC' },
        { label: 'São Paulo', value: 'SP' },
        { label: 'Sergipe', value: 'SE' },
        { label: 'Tocantins', value: 'TO' }
    ];
    weekDays = [
        { label: 'Seg', value: 0 },
        { label: 'Ter', value: 1 },
        { label: 'Qua', value: 2 },
        { label: 'Qui', value: 3 },
        { label: 'Sex', value: 4 },
        { label: 'Sáb', value: 5 },
        { label: 'Dom', value: 6 }
    ];

    isSidebarVisible:boolean = false;

    options: any;
    optionsSeller: any;

    constructor(
        private fb: FormBuilder,
        private sellerService: SellerService,
        private loadingService: LoadingService,
        private router: Router) {
        this.createForm();
    }

    createForm(): void {
        this.sellerForm = this.fb.group({
            id: [null],
            name: [null, Validators.required],
            phone: [null, Validators.required],
            addresses: this.fb.array([])
        });

        this.addAddress();
    }

    getZipCode(index: number){
        this.loadingService.show();
        const zipCode = this.addresses.at(index).get('zipCode')?.value;
        this.sellerService.getZipCode(zipCode).subscribe({
            next:(value) => {
                console.log(value);
                this.loadingService.hide();
            },
            error:(err) =>{
                console.log(err);
                this.loadingService.hide();
            },
        })
    }
    
    ngOnInit(): void {
        this.getSellerDate();
    }
    
    getSellerDate(){
        this.loadingService.show();
        this.sellerService.getSeller().subscribe({
            next:(result) => {
                this.seller = result;
                this.patchSellerData(this.seller);
                console.log(this.seller);
                this.loadingService.hide();
            },
            error:(err) => {
                console.log(err);
                this.loadingService.hide();
            },
        })
    }

    resetSellerData(){
        this.patchSellerData(this.seller!);
    }

    patchSellerData(seller: Seller){
        this.sellerForm.patchValue({
            name: seller.name,
            phone: seller.phoneNumber,
        });
        this.patchAddresses(seller.listPickupLocations);
    }

    get addresses(): FormArray {
        return this.sellerForm.get('addresses') as FormArray;
    }

    patchAddresses(pickupLocations:PickupLocation[]){
        this.addresses.clear();
        pickupLocations.forEach(location => {

            const addressGroup = this.fb.group({
                neighborhood: [location.neighborhood, Validators.required],
                city: [location.city, Validators.required],
                state: [location.state, Validators.required],
                zipCode: [location.zipCode, Validators.required],
                number: [location.number, Validators.required],
                street: [location.state, Validators.required],
                pickupDays: [location.pickupDays, Validators.required]
            });
            
            this.addresses.push(addressGroup);
        })
    }

    addAddress(): void {
        const addressGroup = this.fb.group({
            neighborhood: [null, Validators.required],
            city: [null, Validators.required],
            state: [null, Validators.required],
            zipCode: [null, Validators.required],
            number: [null, Validators.required],
            street: [null, Validators.required],
            pickupDays: [[], Validators.required]
        });
        this.addresses.push(addressGroup);
    }

    removeAddress(index: number): void {
        if (this.addresses.length > 1) {
            this.addresses.removeAt(index);
        }
    }

    navigateToHome() {
        this.router.navigate(['/seller'])
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

    getFieldError(fieldName: string): string {
        const field = this.sellerForm.get(fieldName);
        if (field?.errors && field.touched) {
            if (field.errors['required']) {
                return `${this.getFieldLabel(fieldName)} é obrigatório`;
            }
        }
        return '';
    }

    toggleSidebar() {
        this.isSidebarVisible = !this.isSidebarVisible;
    }
}