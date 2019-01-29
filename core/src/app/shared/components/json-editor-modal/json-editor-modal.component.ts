import { Component, Input, ViewChild } from '@angular/core';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import { ComponentCommunicationService } from '../../services/component-communication.service';
import { ModalService } from 'fundamental-ngx';

@Component({
  selector: 'app-json-editor-modal',
  templateUrl: './json-editor-modal.component.html',
  styleUrls: ['./json-editor-modal.component.scss']
})
export class JsonEditorModalComponent {
  @Input() resourceData: any;
  @ViewChild('jsoneditor') jsonEditor: JsonEditorComponent;
  @ViewChild('jsonEditorModal') jsonEditorModal: any;

  public isActive = false;
  public error: any;

  constructor(
    private communicationService: ComponentCommunicationService,
    private modalService: ModalService
  ) {}

  show() {
    this.isActive = true;

    this.modalService.open(this.jsonEditorModal).result
        .finally(() => {
          this.isActive = false;
          this.error = false;
          event.stopPropagation();    
        })
  }

  cancel(event: Event) {
    this.modalService.close(this.jsonEditorModal);
  }

  update(event: Event) {
    this.jsonEditor.updateYaml().subscribe(
      data => {
        event.stopPropagation();
        this.isActive = false;
        this.communicationService.sendEvent({
          type: 'updateResource',
          data
        });
        this.modalService.close(this.jsonEditorModal);
      },
      err => this.displayErrorMessage(err)
    );
  }

  displayErrorMessage(httpErrorResponse) {
    this.error = httpErrorResponse.error;
  }
}







// import { Component, Input, ViewChild } from '@angular/core';
// import { JsonEditorComponent } from './json-editor/json-editor.component';
// import { ComponentCommunicationService } from '../../services/component-communication.service';

// @Component({
//   selector: 'app-json-editor-modal',
//   templateUrl: './json-editor-modal.component.html',
//   styleUrls: ['./json-editor-modal.component.scss']
// })
// export class JsonEditorModalComponent {
//   @Input() resourceData: any;
//   @ViewChild('jsoneditor') jsonEditor: JsonEditorComponent;
//   public isActive = false;
//   public error: any;

//   constructor(private communicationService: ComponentCommunicationService) {}

//   show() {
//     this.isActive = true;
//   }

//   cancel(event: Event) {
//     this.isActive = false;
//     this.error = false;
//     event.stopPropagation();
//   }

//   update(event: Event) {
//     this.jsonEditor.updateYaml().subscribe(
//       data => {
//         event.stopPropagation();
//         this.isActive = false;
//         this.communicationService.sendEvent({
//           type: 'updateResource',
//           data
//         });
//       },
//       err => this.displayErrorMessage(err)
//     );
//   }

//   displayErrorMessage(httpErrorResponse) {
//     this.error = httpErrorResponse.error;
//   }
// }

