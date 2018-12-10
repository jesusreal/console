import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonEditorModalComponent } from './json-editor-modal.component';
import { AppModule } from '../../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { MockLuigiClientCommunicationDirective } from '../../mocks/mock-luigi-client-communication-directive';
import { LuigiClientCommunicationDirective } from '../../../shared/directives/luigi-client-communication/luigi-client-communication.directive';

describe('ResourceEditorModalComponent', () => {
  let component: JsonEditorModalComponent;
  let fixture: ComponentFixture<JsonEditorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [[{ provide: APP_BASE_HREF, useValue: '/my/app' }]]
    })
      .overrideModule(AppModule, {
        remove: {
          declarations: [LuigiClientCommunicationDirective]
        },
        add: {
          declarations: [MockLuigiClientCommunicationDirective]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
