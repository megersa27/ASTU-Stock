import * as userService from '../services/userService.js';

if (!userService.activateUserAccount || !userService.deleteUserAccount) {
  throw new Error('activateUserAccount and deleteUserAccount exports are required');
}

console.log('User activation and delete exports are available');
