import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'y-empty-list',
  templateUrl: './empty-list.component.html',
  styleUrls: ['./empty-list.component.scss'],
})
export class EmptyListComponent {
  @Input()
  emptyListPlaceholderData: {
    header: { text: string; actionButton: string };
    body: { text: string; actionButton: string };
  };
  @Output() buttonClicked = new EventEmitter();

  onButtonClicked() {
    this.buttonClicked.emit();
  }
}
