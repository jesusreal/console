import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalService } from 'fundamental-ngx';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @Input() message: string;
  @Input() title: string;

  @ViewChild('confirmationModal') confirmationModal: any;

  isActive = false;
  private okPromise: any;
  private cancelPromise: any;
  constructor(
    private modalService: ModalService
  ) {}

  ngOnInit() {}

  show(title?: string, message?: string): Promise<boolean> {
    if (title) {
      this.title = title;
    }
    if (message) {
      this.message = message;
    }
    this.isActive = true;

    this.modalService.open(this.confirmationModal).result
      .finally(() => {
        this.cancelPromise(false);
        this.isActive = false;
        event.stopPropagation();    
      })

    return new Promise((resolve, reject) => {
      this.okPromise = resolve;
      this.cancelPromise = reject;
    });
  }

  cancel(event: Event) {
    this.modalService.close(this.confirmationModal);
  }

  ok(event: Event) {
    this.okPromise(true);
    this.isActive = false;
    event.stopPropagation();
  }
}
