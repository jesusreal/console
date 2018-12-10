import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OAuthService } from 'angular-oauth2-oidc';
import { ClipboardModule } from 'ngx-clipboard';

import { Copy2ClipboardModalComponent } from './copy2clipboard-modal.component';
import { MockLuigiClientCommunicationDirective } from '../../mocks/mock-luigi-client-communication-directive';

const FakeOAuthService = {};

describe('Copy2ClipboardModalComponent', () => {
  let component: Copy2ClipboardModalComponent;
  let fixture: ComponentFixture<Copy2ClipboardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        Copy2ClipboardModalComponent,
        MockLuigiClientCommunicationDirective
      ],
      imports: [ClipboardModule],
      providers: [{ provide: OAuthService, useValue: FakeOAuthService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Copy2ClipboardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
