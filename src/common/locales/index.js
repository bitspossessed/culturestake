const components = {
  Table: {
    messageEmpty: 'No entries given',
    messageError: 'Something went wrong ...',
    messageLoading: 'Loading ...',
  },
  FormLogin: {
    buttonSubmit: 'Login',
    errorAuthentication: 'The credentials are incorrect, please try again.',
    fieldEmail: 'Your Email-address:',
    fieldPassword: 'Your password:',
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
  ...views,
};
