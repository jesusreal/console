import { Component, OnInit, ViewChild } from '@angular/core';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  templateUrl: './environment-create-wrapper.component.html'
})
export class EnvironmentCreateWrapper implements OnInit {
  @ViewChild('createEnvModal') modal;

  ngOnInit() {
    this.modal.show();
  }

  handleEnvCreated() {
    LuigiClient.uxManager().refreshContextSwitcher();
  }
}
