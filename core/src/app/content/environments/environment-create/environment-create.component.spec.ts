import { MockLuigiClientCommunicationDirective } from './../../../shared/mocks/mock-luigi-client-communication-directive';
import { LuigiClientCommunicationDirective } from './../../../shared/directives/luigi-client-communication/luigi-client-communication.directive';
import { AppModule } from './../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { EnvironmentCreateComponent } from './environment-create.component';

describe('EnvironmentCreateComponent', () => {
  let component: EnvironmentCreateComponent;
  let fixture: ComponentFixture<EnvironmentCreateComponent>;

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
    fixture = TestBed.createComponent(EnvironmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
