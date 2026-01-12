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
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";


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
    SelectModule,
],
    templateUrl: './seller.component.html',
    styleUrl: './seller.component.scss'
})
export class SellerComponent implements OnInit {
    value: any;
    data: any;
    dataSeller: any;
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


    isSidebarVisible:boolean = false;

    options: any;
    optionsSeller: any;

    constructor(
        private fb: FormBuilder,
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

    ngOnInit(): void {
    }




    get addresses(): FormArray {
        return this.sellerForm.get('addresses') as FormArray;
    }

    addAddress(): void {
        const addressGroup = this.fb.group({
            street: [null, Validators.required],
            city: [null, Validators.required],
            state: [null, Validators.required],
            zipCode: [null, Validators.required],
            number: [null, Validators.required]
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