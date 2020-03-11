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
  FormFestivals: {
    fieldDescription: 'Description:',
    fieldImages: 'Images:',
    fieldTitle: 'Title:',
  },
  FormUsers: {
    fieldEmail: 'Email-address:',
    fieldPassword: 'Password:',
    fieldUsername: 'Username:',
  },
  InputUploadField: {
    buttonRemoveFile: 'Remove',
    buttonSelectFiles: 'Select files',
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
    notificationSuccess: 'You updated the user {username}.',
    notificationDestroySuccess: 'You deleted user {username}.',
    title: 'Edit user',
  },
  AdminUsersNew: {
    buttonSubmit: 'Create',
    title: 'Create new user',
    notificationSuccess: 'You created the user {username}.',
    errorUniqueUser: 'A user with this email or username exists already.',
  },
  AdminFestivals: {
    buttonNewFestival: 'Create new festival',
    fieldTitle: 'Title',
    fieldDescription: 'Description',
    title: 'Festivals',
  },
  AdminFestivalsEdit: {
    buttonSubmit: 'Save',
    notificationSuccess: 'You updated the festival {title}.',
    notificationDestroySuccess: 'You deleted the festival {title}.',
    title: 'Edit festival',
  },
  AdminFestivalsNew: {
    buttonSubmit: 'Create',
    title: 'Create new festival',
    notificationSuccess: 'You created the festival {title}.',
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
    areYouSure: 'Are you sure you really want to do this?',
    buttonDestroy: 'Delete',
    buttonReturnToOverview: 'Return to overview',
    errorMessage: 'Something went wrong ...',
    tableActionDestroy: 'Delete',
    tableActionEdit: 'Edit',
  },
  ...components,
  ...middlewares,
  ...store,
  ...views,
};
