import { Component, OnInit, ViewChild } from '@angular/core';
//import { EnvironmentCreateComponent } from '../environments/environment-create/environment-create.component';

@Component({
  templateUrl: './environment-create-wrapper.component.html'
})
export class EnvironmentCreateWrapper implements OnInit {
  @ViewChild('createEnvModal') modal;

  ngOnInit() {
    this.modal.show();
  }

  handleEnvCreated() {
    alert('env created');
  }
}
