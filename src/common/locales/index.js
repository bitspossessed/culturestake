const components = {
  AnswersTable: {
    fieldTitle: 'Answer name',
    buttonEdit: 'See Snuggle panel',
  },
  DangerZone: {
    title: 'Danger Zone',
  },
  ContractsOwners: {
    title: 'Contract admins:',
    buttonAddNewOwner: 'Add',
    buttonRemoveOwner: 'Remove',
    fieldOwnerAddress: 'Add new address:',
  },
  ContractsFestivals: {
    buttonInitializeFestival: 'Initialize Festival',
    buttonDeactivateFestival: 'Deactivate Festival',
    notificationAlreadyDeactivated: 'This festival is deactivated',
  },
  ContractsQuestions: {
    buttonInitializeQuestion: 'Initialize Question',
    buttonDeactivateQuestion: 'Deactivate Question',
    notificationAlreadyDeactivated: 'This question is deactivated',
  },
  ContractsAnswers: {
    buttonInitializeAnswer: 'Initialize Answer',
    buttonDeactivateAnswer: 'Deactivate Answer',
    notificationAlreadyDeactivated: 'This answer is deactivated',
  },
  EthereumContainer: {
    bodyInstallMetamask: 'Install MetaMask extension to connect to wallet',
    bodyIsNotOwner: 'Current account is not Contract owner',
    bodyYourAddress: 'Your address:',
    buttonEnable: 'Enable Ethereum wallet',
    title: 'Smart Contracts Snuggle Panel (SCSP)',
  },
  Table: {
    bodyEmpty: 'No entries given',
    bodyError: 'Something went wrong ...',
    bodyLoading: 'Loading ...',
    columnCreatedAt: 'Created at',
    columnUpdatedAt: 'Updated at',
  },
  FormLogin: {
    fieldEmail: 'Your Email-address:',
    fieldPassword: 'Your password:',
  },
  FormFestivals: {
    fieldDescription: 'Description:',
    fieldDocuments: 'Documents',
    fieldImages: 'Images',
    fieldSticker: 'Sticker',
    fieldSubtitle: 'Subtitle',
    fieldTitle: 'Title:',
    fieldArtworks: 'Artworks:',
  },
  FormUsers: {
    fieldEmail: 'Email-address:',
    fieldPassword: 'Password:',
    fieldUsername: 'Username:',
  },
  FormQuestions: {
    fieldTitle: 'Question text:',
  },
  FormProperties: {
    fieldTitle: 'Property:',
  },
  FormArtworks: {
    fieldTitle: 'Title:',
    fieldDescription: 'Description:',
    fieldImages: 'Artwork images',
  },
  FormArtists: {
    fieldName: 'Name:',
    fieldBio: 'Bio:',
    fieldConsentToDataReveal: 'Consent to data reveal:',
    fieldImages: 'Artwork images',
  },
  Loading: {
    bodyLoading: 'Loading ...',
  },
  Navigation: {
    linkAdminDashboard: 'Dashboard',
    linkAdminFestivals: 'Festivals',
    linkAdminSignOut: '🚪',
    linkAdminUsers: 'Users',
    notificationSignOutSuccess: 'Your session has ended. See you soon!',
    titleAccessibility: 'Accessibility',
    titleAdmin: 'Admin:',
    titleFestivals: 'Festivals:',
  },
  InputUploadField: {
    buttonRemoveFile: 'Remove',
    buttonSelectFiles: 'Select files',
  },
  InputStickerField: {
    buttonGenerateParticles: 'Generate particles',
  },
  VoteCreditsBar: {
    voteCredits: 'Vote Credits',
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
    errorNotFound: 'This user does not exist.',
    notificationSuccess: 'You updated the user {username}.',
    notificationDestroySuccess: 'You deleted user {username}.',
    title: 'Edit user',
  },
  AdminUsersNew: {
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
    errorNotFound: 'This festival does not exist.',
    notificationDestroySuccess: 'You deleted the festival {title}.',
    notificationSuccess: 'You updated the festival {title}.',
    title: 'Edit festival',
  },
  AdminFestivalsNew: {
    title: 'Create new festival',
    notificationSuccess: 'You created the festival {title}.',
  },
  AdminQuestions: {
    buttonNewQuestion: 'Create new question',
    fieldTitle: 'Title',
    fieldDescription: 'Description',
    title: 'Questions',
  },
  AdminQuestionsNew: {
    title: 'Create new question',
    fieldFestival: 'Festival',
    fieldPlaceholder: 'Choose a festival',
    notificationSuccess: 'You created the question {title}.',
  },
  AdminQuestionsEdit: {
    errorNotFound: 'This question does not exist.',
    notificationDestroySuccess: 'You deleted the question {title}.',
    notificationSuccess: 'You updated the question {title}.',
    title: 'Edit question',
    buttonNewAnswer: 'Add a new answer to this question',
  },
  AdminAnswersNew: {
    title: 'Create new answer',
    fieldArtwork: 'Artwork',
    fieldArtworkPlaceholder: 'Choose an artwork',
    notificationSuccess: 'You created a new answer.',
  },
  AdminAnswersEdit: {
    title: 'Edit question',
  },
  AdminProperties: {
    buttonNewQuestion: 'Create new property',
    fieldTitle: 'Property',
    title: 'Properties',
  },
  AdminPropertiesNew: {
    title: 'Create new property',
    notificationSuccess: 'You created the property {title}.',
  },
  AdminPropertiesEdit: {
    title: 'Edit property',
    notificationSuccess: 'You edited the property {title}.',
  },
  AdminArtworks: {
    buttonNewQuestion: 'Create new artwork',
    fieldTitle: 'Title',
    title: 'Artworks',
  },
  AdminArtworksNew: {
    title: 'Create new artwork',
    notificationSuccess: 'You created the artwork {title}.',
    fieldArtist: 'Artist:',
    fieldArtistPlaceholder: 'Choose an artist',
  },
  AdminArtworksEdit: {
    title: 'Edit artwork',
    notificationSuccess: 'You edited the artwork {title}.',
    errorNotFound: 'This artwork does not exist',
    notificationDestroySuccess: 'You deleted the artwork {title}',
    fieldArtist: 'Artist:',
  },
  AdminArtists: {
    buttonNewQuestion: 'Create new artist',
    fieldName: 'Name',
    title: 'Artists',
  },
  AdminArtistsNew: {
    title: 'Create new artist',
    notificationSuccess: 'You created the artist {name}.',
  },
  AdminArtistsEdit: {
    title: 'Edit artist',
    notificationSuccess: 'You edited the artist {name}.',
    errorNotFound: 'This artist does not exist',
    notificationDestroySuccess: 'You deleted the artist {name}',
  },
  Homepage: {
    bodyIntroduction:
      'Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores similique aliquid laborum nobis maxime officiis. Quod delectus amet ut. Itaque similique qui excepturi sint eaque porro corrupti.  Adipisci illum ea sint eaque.',
    bodyIntroductionSecondary:
      'Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores similique aliquid laborum nobis maxime officiis. Quod delectus amet ut. Itaque similique qui excepturi sint eaque porro corrupti.  Adipisci illum ea sint eaque.',
    bodyStatisticsArtists: 'Artist',
    bodyStatisticsArtworks: 'Artworks',
    bodyStatisticsFestivals: 'Festivals',
    buttonViewFestivals: 'View Festivals',
  },
  NotFound: {
    title: 'Not Found',
  },
};

export default {
  title: 'Future Fairness',
  default: {
    areYouSure: 'Are you sure you really want to do this?',
    buttonDestroy: 'Delete',
    buttonLoadMore: 'Load more',
    buttonReturnToOverview: 'Return to overview',
    buttonSubmitEdit: 'Save',
    buttonSubmitNew: 'Create',
    errorMessage: 'Something went wrong ...',
    tableActionDestroy: 'Delete',
    tableActionEdit: 'Edit',
  },
  ...components,
  ...middlewares,
  ...store,
  ...views,
};
