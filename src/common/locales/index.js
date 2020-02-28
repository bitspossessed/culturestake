const components = {
  Table: {
    bodyEmpty: 'No entries given',
    bodyError: 'Something went wrong ...',
    bodyLoading: 'Loading ...',
  },
  FormLogin: {
    fieldEmail: 'Your Email-address:',
    fieldPassword: 'Your password:',
  },
  FormUsers: {
    fieldEmail: 'Email-address:',
    fieldPassword: 'Password:',
    fieldUsername: 'Username:',
  },
};

const middlewares = {
  apiError: {
    errorExpiredSession: 'Your session has expired. Please login again.',
  },
};

const store = {
  app: {
    notificationTokenSuccess: 'Login successful! Welcome!',
    errorTokenFailure: 'Login failed, please try again.',
  },
};

const views = {
  Admin: {
    title: 'Admin',
  },
  AdminLogin: {
    buttonSubmit: 'Login',
    title: 'Login',
  },
  AdminUsers: {
    buttonNewUser: 'Create new user',
    fieldEmail: 'Email-address',
    fieldUsername: 'Username',
    title: 'Users',
  },
  AdminUsersEdit: {
    buttonSubmit: 'Save',
    title: 'Edit user',
  },
  AdminUsersNew: {
    buttonSubmit: 'Create',
    title: 'Create new user',
  },
  Homepage: {
    title: 'Hello, Decal!',
  },
  NotFound: {
    title: 'Not Found',
  },
};

export default {
  default: {
    buttonReturnToOverview: 'Return to overview',
    tableActionDestroy: 'Delete',
    tableActionEdit: 'Edit',
  },
  ...components,
  ...middlewares,
  ...store,
  ...views,
};
