import { MockLuigiClientCommunicationDirective } from './../../../mocks/mock-luigi-client-communication-directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceUploaderModalComponent } from './resource-uploader-modal.component';
import { InformationModalComponent } from '../../information-modal/information-modal.component';
import { UploaderComponent } from '../uploader/uploader.component';
import { ComponentCommunicationService } from '../../../services/component-communication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';

describe('ResourceUploaderModalComponent', () => {
  let component: ResourceUploaderModalComponent;
  let fixture: ComponentFixture<ResourceUploaderModalComponent>;
  const routes: Routes = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ResourceUploaderModalComponent,
        InformationModalComponent,
        UploaderComponent,
        MockLuigiClientCommunicationDirective
      ],
      providers: [ComponentCommunicationService],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceUploaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
