import waitForNavigationAndContext from '../utils/waitForNavigationAndContext';
import request from 'request';
import address from '../utils/address';

async function _loginViaDex(page, config) {
  const loginButtonSelector = '.dex-btn';
  console.log(`Trying to log in ${config.login} via dex`);
  try {
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('#login');
    await page.type('#login', config.login);
    await page.waitForSelector('#password');
    await page.type('#password', config.password);
    await page.waitForSelector(loginButtonSelector);
    await page.click(loginButtonSelector);
  } catch (err) {
    throw new Error(`Couldn't log in`, err);
  }
}

async function login(page, config) {
  await _loginViaDex(page, config);
  const headerSelector = '.fd-shellbar';
  try {
    await page.waitForSelector(headerSelector);
  } catch (err) {
    console.error(err);
    console.log('Trying to obtain error message');
    await obtainLoginErrorMessage();
  }

  async function obtainLoginErrorMessage() {
    await page.waitForSelector('#login-error');
    const loginError = await page.evaluate(
      () => document.querySelector('#login-error').textContent
    );
    throw new Error(
      `Page returned following error message: ${loginError.trim()}`
    );
  }
}

async function getFrame(page) {
  const noOfFrames = page.frames().length;
  return await page.frames()[noOfFrames - 1];
}

async function openLink(page, element, name) {
  await page.$$eval(
    element,
    (item, name) => {
      item.find(text => text.innerText.includes(name)).click();
    },
    name
  );
  await page.reload({ waitUntil: 'networkidle0' });
  await waitForNavigationAndContext(page);
}

function clearData(token, env) {
  const req = {
    url: address.api.getNamespace(env),
    method: 'DELETE',
    headers: { Authorization: token },
    // TODO: Analyze problem with UNABLE_TO_VERIFY_LEAF_SIGNATURE
    rejectUnauthorized: false
  };

  return new Promise((resolve, reject) => {
    request(req, (error, response) => {
      if (error) {
        reject(error);
      }

      if (response) {
        console.log(`Removing ${env} environment`);
        resolve(response);
      }
    });
  });
}

async function getEnvironmentsFromContextSwitcher(page) {
  return await page.evaluate(() => {
    const menuListContainer = document.querySelector('ul.fd-menu__list');
    const environmentsArraySelector = 'li > a';
    const envs = Array.from(
      menuListContainer.querySelectorAll(environmentsArraySelector)
    );
    return envs.map(env => env.textContent);
  });
}

async function getEnvironmentNamesFromEnvironmentsPage(page) {
  const environmentCardTitleSelector = '.tn-card__header';
  const frame = await getFrame(page);

  const envNames = await frame.$$eval(
    environmentCardTitleSelector,
    environmentCardTitles => {
      const envs = Array.from(environmentCardTitles);
      return envs.map(env => env.textContent);
    }
  );
  return envNames;
}

async function createEnvironment(page, name) {
  const frame = await getFrame(page);
  const createEnvModal = '.sf-modal.sf-modal--min';
  const createBtn = '.env-create-btn';
  const envNameInput = 'input[name=environmentName].tn-form__control';
  const createButtonSelector = '.open-create-env-modal';

  await frame.waitForSelector(createButtonSelector);
  await frame.click(createButtonSelector);
  await frame.waitFor(createEnvModal);
  await frame.focus(envNameInput);
  await frame.type(envNameInput, name);
  await frame.click(createBtn);
  await frame.waitForSelector(createEnvModal, { hidden: true });

  await page.reload({ waitUntil: 'networkidle0' });
  await waitForNavigationAndContext(page);
}

async function deleteEnvironment(page, envName) {
  const frame = await getFrame(page);
  const deleteConfirmButton =
    '.tn-modal__button-primary.sf-button--primary.tn-button--small';
  const dropDownCard = `button[aria-controls=${envName}]`;
  await frame.click(dropDownCard);
  await frame.click(`#${envName} > li > a[name=Delete]`);
  await frame.waitFor(deleteConfirmButton);
  await frame.click(deleteConfirmButton);
  await frame.waitForSelector(deleteConfirmButton, { hidden: true });
}

async function getRemoteEnvironments(page) {
  return await page.evaluate(() => {
    const remoteEnvironmentsSelector = '.remoteenv-name';
    const envs = Array.from(
      document.querySelectorAll(remoteEnvironmentsSelector)
    );
    return envs.map(env => env.textContent);
  });
}

async function createRemoteEnvironment(page, name) {
  // consts
  const createEnvBtn = '.open-create-env-modal';
  const createEnvModal = '.sf-modal.sf-modal--min';
  const nameInput = 'input[name=remoteEnvName]';
  const descriptionInput = 'input[name=remoteEnvDescription]';
  const labelsInput = 'input[name=labelsInput]';
  const createButton = '.tn-modal__button-primary';

  await page.click(createEnvBtn);
  await page.waitFor(createEnvModal);
  await page.focus(nameInput);
  await page.type(nameInput, name);
  await page.focus(descriptionInput);
  await page.type(
    descriptionInput,
    'This is the Remote Environment for testing'
  );
  await page.focus(labelsInput);
  await page.type(labelsInput, 'testKey:testValue');
  await page.click(createButton);
  await page.waitForSelector(createEnvModal, { hidden: true });
}

async function getRemoteEnvironmentsAfterDelete(
  page,
  initialRemoteEnvironments
) {
  await page.reload({ waitUntil: 'networkidle0' });
  const remoteEnvironments = await getRemoteEnvironments(page);
  if (initialRemoteEnvironments > remoteEnvironments) {
    console.log('Remote environments was updated');
    return remoteEnvironments;
  }
  throw new Error(`Remote environments was not updated`);
}

async function deleteRemoteEnvironment(page, name) {
  const remoteEnvironmentsSelector = '.row.sf-list__body';
  const modalSelector = '.sf-modal';
  await page.waitForSelector(remoteEnvironmentsSelector);
  await page.$$eval(
    remoteEnvironmentsSelector,
    (item, name) => {
      const actionsSelector = '.tn-icon';
      const deleteActionSelector = `.tn-dropdown__item[name=Delete]`;
      const testRemoteEnvironment = item.find(row =>
        row.textContent.includes(name)
      );
      testRemoteEnvironment.querySelector(actionsSelector).click();
      testRemoteEnvironment.querySelector(deleteActionSelector).click();
    },
    name
  );
  await page.waitForSelector(modalSelector);
  await page.evaluate(() => {
    const deleteButton = `.tn-modal__button-primary.sf-button--primary.tn-button--small`;
    document.querySelector(deleteButton).click();
  });
}

module.exports = {
  login,
  getFrame,
  openLink,
  clearData,
  getEnvironmentsFromContextSwitcher,
  createEnvironment,
  getRemoteEnvironments,
  getRemoteEnvironmentsAfterDelete,
  createRemoteEnvironment,
  deleteRemoteEnvironment,
  getEnvironmentNamesFromEnvironmentsPage,
  deleteEnvironment
};
