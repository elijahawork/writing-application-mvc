import { access, promises } from 'fs';
import { join } from 'path';
import React from 'react';
import reactDOM from 'react-dom';
import API from './api/API';
import App from './view/App';

const __PROJ_NAME = join(__dirname, '..', 'protected');

(async () => {
  // creates the project directory
  // if the project directory does not exist

  // this works by attempting to access the directory
  // if the directory does not exists, it throws an error
  // and if there is an error, than that is truthy
  // and that means that because no directory exists
  // it can be made safely
  // and then it makes the directory
  access(__PROJ_NAME, async (pathDoesNotExist) => {
    if (pathDoesNotExist) {
      await promises.mkdir(__PROJ_NAME);
    }
  });
})();
