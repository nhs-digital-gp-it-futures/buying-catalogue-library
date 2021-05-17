// import express from 'express';
// import { FakeAuthProvider } from '../../test-utils/fakeAuthProvider';
// import { cookiePolicyAgreed, cookiePolicyClear } from './index';

// xdescribe('cookiePolicy', () => {
//   const setupTestApp = (mockLogoutMethod) => {
//     const app = express();
//     const authProvider = new FakeAuthProvider(mockLogoutMethod);
//     authProvider.setup(app);
//     const router = express.Router();
//     app.use(router);
//     return { app, router, authProvider };
//   };


//   const mockLogger = {
//     debug: () => { },
//     info: () => { },
//     warn: () => { },
//     error: () => { },
//   };

//   beforeEach(() => {

//   });

//   it('should create cookie', () => {
//     expect(true).toEqual(false);
//   });
// });
