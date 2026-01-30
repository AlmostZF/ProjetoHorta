import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

// primeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { SelectModule } from 'primeng/select';
import { SellerService } from '../../../service/seller.service';
import { PickupLocation, Seller, UpdateSeller, ViaCepResponse } from '../../../models/seller.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LoadingService } from '../../../service/loading.service';
import { WeekDay, States } from '../../../utils/seller_utils';


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
    SelectButtonModule,
    NgxMaskDirective,
    ],
    providers:[provideNgxMask()],
    templateUrl: './seller.component.html',
    styleUrl: './seller.component.scss'
})
export class SellerComponent implements OnInit {
    value: any;
    data: any;
    seller: Seller | null = null;
    sellerForm!: FormGroup;
    phoneMask: string = '(00) 0 0000-0000'; 
    cepMask: string = '00000-000'
    errorData:boolean = false;
    errorPickup:boolean = false;

    states = States;

    weekDays = WeekDay

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

    ngOnInit(): void {
        this.getSellerDate();
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
            next:(result) => {
                console.log(result);
                this.patchAdressById(index, result);
                this.loadingService.hide();
            },
            error:(err) =>{
                console.log(err);
                this.loadingService.hide();
            },
        })
    }
    
    
    private createSellerPayload(sellerForm: FormGroup):UpdateSeller{
        return{
            id: sellerForm.get('id')?.value,
            name:sellerForm.get('name')?.value,
            phoneNumber: sellerForm.get('phone')?.value
        }
    }

    validateSellerDate(): void {
        this.sellerForm.markAllAsTouched();

        if (this.sellerForm.get('name')?.getRawValue()!== '' &&
            this.sellerForm.get('phone')?.getRawValue()!== '')
        {
            this.updateSellerData();
            return;
        }

        this.errorData = true;
    }

    validateSellerPickup():void{
        this.sellerForm.markAllAsTouched();

        const hasAddresses = this.addresses.length > 0;
        const isAddressesValid = this.addresses.valid;
        console.log(hasAddresses)
        console.log(isAddressesValid)
        console.log(this.addresses)

        if (hasAddresses && isAddressesValid) {
            this.updateSellerPickup();
            return;
        }

        this.errorPickup = true;
    }

    updateSellerData(){
        this.loadingService.show();
        const payload = this.createSellerPayload(this.sellerForm);  
        this.sellerService.updateSeller(payload).subscribe({
            next:(result) =>{
                this.getSellerDate();
                this.loadingService.hide();
            }, 
            error:(error) => {
                console.log(error);
                this.loadingService.hide();
            }
        })
    }

    updateSellerPickup(){
        this.loadingService.show();
        this.sellerService.updatePickupLocation(this.addresses.value).subscribe({
            next:(result) =>{
                this.getSellerDate();
                this.loadingService.hide();
            }, 
            error:(error) => {
                console.log(error);
                this.loadingService.hide();
            }
        })
    }
    
    getSellerDate(){
        this.loadingService.show();
        this.sellerService.getSeller().subscribe({
            next:(result) => {
                this.seller = result;
                this.patchSellerData(result);
                this.patchAddresses(result.listPickupLocations);
                this.loadingService.hide();
                this.createSellerPayload(this.sellerForm);
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
            id: this.seller?.id,
            name: seller.name,
            phone: seller.phoneNumber,
        });
    }

    patchAdressById(index: number, viaCepResponse: ViaCepResponse){
        this.addresses.at(index).patchValue({
            neighborhood: viaCepResponse.bairro ,
            city: viaCepResponse.localidade,
            state: viaCepResponse.uf,
            number: '',
            street: viaCepResponse.logradouro,
        })
    }

    get addresses(): FormArray {
        return this.sellerForm.get('addresses') as FormArray;
    }

    patchAddresses(pickupLocations:PickupLocation[] | undefined){
        this.addresses.clear();
        pickupLocations?.forEach(location => {
            const addressGroup = this.fb.group({
                id: [location.id, Validators.required],
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
            id: [null, Validators.required],
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