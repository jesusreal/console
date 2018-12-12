import LuigiClient from '@kyma-project/luigi-client';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

LuigiClient.addInitListener(initialContext => {
  // this.environmentId = initialContext.environmentId;
  console.info(`InitialContext sent ${initialContext}. bootstraping app`);
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.log(err));
});
