import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule
  ],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {
  @Input() name: string = '';
  @Input() image: string = '';
  @Input() description: string = '';
  @Input() unitValue: number = 0;
  @Input() HeightCard: string = 'h-48';

  @Output() cardClick = new EventEmitter<void>();

  onClick() {
    this.cardClick.emit();
  }
}

