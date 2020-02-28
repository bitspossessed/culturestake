const components = {
  Table: {
    bodyEmpty: 'No entries given',
    bodyError: 'Something went wrong ...',
    bodyLoading: 'Loading ...',
  },
  FormLogin: {
    buttonSubmit: 'Login',
    fieldEmail: 'Your Email-address:',
    fieldPassword: 'Your password:',
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
  AdminUsers: {
    fieldEmail: 'Email-address',
    fieldUsername: 'Username',
    title: 'Users',
  },
  Homepage: {
    title: 'Hello, Decal!',
  },
};

export default {
  default: {
    tableActionDestroy: 'Delete',
    tableActionEdit: 'Edit',
  },
  ...components,
  ...middlewares,
  ...store,
  ...views,
};
