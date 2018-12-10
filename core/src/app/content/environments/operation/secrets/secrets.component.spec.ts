import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SecretsComponent } from './secrets.component';
import { AppModule } from '../../../../app.module';
import { ListModule } from '@kyma-project/y-generic-list';
import { APP_BASE_HREF } from '@angular/common';
import { MockLuigiClientCommunicationDirective } from '../../../../shared/mocks/mock-luigi-client-communication-directive';
import { LuigiClientCommunicationDirective } from '../../../../shared/directives/luigi-client-communication/luigi-client-communication.directive';

describe('SecretsComponent', () => {
  let component: SecretsComponent;
  let fixture: ComponentFixture<SecretsComponent>;

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
    fixture = TestBed.createComponent(SecretsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
