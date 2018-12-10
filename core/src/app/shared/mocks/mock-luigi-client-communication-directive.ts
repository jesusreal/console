import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[luigiClientCommunication]'
})
export class MockLuigiClientCommunicationDirective {
  @Input() isActive: boolean;
  constructor() {}
}
