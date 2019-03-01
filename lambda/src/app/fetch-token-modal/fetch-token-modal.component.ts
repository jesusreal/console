import { Component, Input, ViewChild } from '@angular/core';
import { Clipboard } from 'ts-clipboard';

import * as luigiClient from '@kyma-project/luigi-client';
import { ModalService, ModalComponent } from 'fundamental-ngx';

@Component({
  selector: 'app-fetch-token-modal',
  styleUrls: ['./fetch-token-modal.component.scss'],
  templateUrl: './fetch-token-modal.component.html',
})
export class FetchTokenModalComponent {
  @ViewChild('fetchTokenModal') fetchTokenModal: ModalComponent;

  public title: string;
  public token: string;
  public isTokenCopied = false;

  constructor(private modalService: ModalService) {}

  public show() {
    this.title = 'Fetch token';

    luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      this.token = `Bearer ${eventData.idToken}`;
    });

    this.modalService.open(this.fetchTokenModal).result.finally(() => {
      this.isTokenCopied = false;
      event.stopPropagation();
    });
  }

  public cancel(event: Event) {
    this.modalService.close(this.fetchTokenModal);
  }

  public copyToken() {
    Clipboard.copy(this.token);
    this.isTokenCopied = true;
    this.removeSuccessClass();
  }

  public removeSuccessClass() {
    setTimeout(_ => {
      this.isTokenCopied = false;
    }, 2500);
  }
}
