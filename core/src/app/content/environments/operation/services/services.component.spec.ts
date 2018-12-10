import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesComponent } from './services.component';
import { AppModule } from '../../../../app.module';
import { ListModule } from '@kyma-project/y-generic-list';
import { APP_BASE_HREF } from '@angular/common';
import { MockLuigiClientCommunicationDirective } from '../../../../shared/mocks/mock-luigi-client-communication-directive';
import { LuigiClientCommunicationDirective } from '../../../../shared/directives/luigi-client-communication/luigi-client-communication.directive';

describe('ServicesComponent', () => {
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ListModule],
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
    fixture = TestBed.createComponent(ServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
