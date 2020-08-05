const components = {
  AnswersTable: {
    buttonEdit: 'Edit',
    fieldTitle: 'Answer name',
  },
  Barcode: {
    bodyBarcode: 'Barcode',
    bodyLink: 'Show image',
    title: 'Barcode',
  },
  BoothContainer: {
    bodyBoothIsDeactivated: 'Booth was deactivated and is not valid anymore',
    bodyPendingInitialization: 'Waiting for initialization by admin ...',
    bodyYourAddress: 'Address:',
    buttonInitializeBooth: 'Create booth account',
    buttonBurnBooth: 'Remove booth account',
    title: 'Voting booth setup',
  },
  BoothsTable: {
    alreadyDeactivated: 'deactivated',
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
  ContractsBooths: {
    buttonAddNewBooth: 'Initialize New Voting Booth',
    fieldBoothAddress: 'Booth Address:',
    fieldFestivalChainId: 'Festival:',
    fieldFestivalPlaceholder: 'Choose a festival',
    title: 'Add New Voting Booth',
  },
  ContractsFestivals: {
    bodyAlreadyDeactivated: 'This festival is deactivated',
    bodyFestivalStartTime: 'From date:',
    bodyFestivalEndTime: 'To date:',
    buttonDeactivateFestival: 'Deactivate Festival',
    buttonInitializeFestival: 'Initialize Festival',
  },
  ContractsQuestions: {
    bodyAlreadyDeactivated: 'This question is deactivated',
    bodyFestivalNotInitialized:
      'The festival for this question still needs to be initialized',
    buttonDeactivateQuestion: 'Deactivate Question',
    buttonInitializeQuestion: 'Initialize Question',
  },
  ContractsAnswers: {
    bodyAlreadyDeactivated: 'This answer is deactivated',
    buttonDeactivateAnswer: 'Deactivate Answer',
    buttonInitializeAnswer: 'Initialize Answer',
  },
  EthereumContainer: {
    bodyInstallMetamask: 'Install MetaMask extension to connect to wallet',
    bodyIsNotOwner: 'Current account is not Contract owner',
    bodyYourAddress: 'Your address:',
    buttonEnable: 'Enable Ethereum wallet',
    title: 'Smart Contracts Snuggle Panel (SCSP)',
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
    fieldUrl: 'Website:',
  },
  FormUsers: {
    fieldEmail: 'Email-address:',
    fieldPassword: 'Password:',
    fieldUsername: 'Username:',
  },
  FormQuestions: {
    fieldArtwork: 'Artwork:',
    fieldFestival: 'Festival:',
    fieldFestivalPlaceholder: 'Search for festival to select',
    fieldArtworkPlaceholder: 'Search for artwork to select',
    fieldTitle: 'Question text:',
  },
  FormProperties: {
    fieldTitle: 'Property:',
  },
  FormArtworks: {
    fieldArtist: 'Artist:',
    fieldArtistPlaceholder: 'Search for artist name',
    fieldDescription: 'Description:',
    fieldDocuments: 'Documents',
    fieldImages: 'Artwork images',
    fieldSticker: 'Sticker',
    fieldTitle: 'Title:',
    fieldSubtitle: 'Subtitle',
    fieldUrl: 'Website:',
  },
  FormArtists: {
    fieldBio: 'Bio:',
    fieldConsentToDataReveal: 'Consent to data reveal:',
    fieldImages: 'Artist images',
    fieldName: 'Name:',
    fieldUrl: 'Website:',
  },
  InputArtworksField: {
    fieldArtwork: 'Artwork:',
    fieldArtworkPlaceholder: 'Search for artwork to add',
    fieldArtworkPrompt: 'Add artwork',
  },
  InputUploadField: {
    buttonRemoveFile: 'Remove',
    buttonSelectFiles: 'Select files',
  },
  InputStickerField: {
    buttonGenerateParticles: 'Generate particles',
  },
  Instructions: {
    title: 'Instructions',
    titleStepOne: '1. Step',
    bodyStepOne:
      'CultureStake connects communities, artists and cultural organisations through playful collective decision-making.',
    titleStepTwo: '2. Step',
    bodyStepTwo:
      'Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores similique aliquid laborum nobis maxime officiis. Quod delectus amet ut. Itaque similique qui excepturi sint eaque porro corrupti.  Adipisci illum ea sint eaque.',
    titleStepThree: '3. Step',
    bodyStepThree:
      'Quibusdam ad vel itaque. Qui nobis enim ullam. Quis asperiores similique aliquid laborum nobis maxime officiis. Quod delectus amet ut. Itaque similique qui excepturi sint eaque porro corrupti.  Adipisci illum ea sint eaque.',
  },
  Loading: {
    bodyLoading: 'Loading ...',
  },
  Navigation: {
    linkAdminArtists: 'Artists',
    linkAdminArtworks: 'Artworks',
    linkAdminBooths: 'Booths',
    linkAdminDashboard: 'Dashboard',
    linkAdminFestivals: 'Festivals',
    linkAdminProperties: 'Properties',
    linkAdminQuestions: 'Questions',
    linkAdminSignOut: '🚪',
    linkAdminUsers: 'Users',
    notificationSignOutSuccess: 'Your session has ended. See you soon!',
    titleAccessibility: 'Accessibility',
    titleAdmin: 'Admin:',
    titleFestivals: 'Festivals:',
  },
  PayerBalance: {
    bodyPayerAddress: 'Address:',
    title: 'Payer Balance',
  },
  Scanner: {
    bodyDescription: 'Use camera to scan code',
    notificationError: 'Camera could not be activated: {error}',
  },
  Table: {
    bodyEmpty: 'No entries given',
    bodyError: 'Something went wrong ...',
    bodyLoading: 'Loading ...',
    columnCreatedAt: 'Created at',
    columnUpdatedAt: 'Updated at',
  },
  VoteCreditsBar: {
    voteCredits: 'Vote Credits',
  },
  VoteSession: {
    bodyYourVotesRecorded: {
      zero: 'Your votes have been recorded.',
      one: 'Your votes have been recorded. Your top artwork is:',
      other: 'Your votes have been recorded. Your top {count} artworks are:',
    },
    buttonNextStep: 'Next',
    buttonPreviousStep: 'Return',
    buttonVoteResults: 'View the vote results so far',
    buttonToHomepage: 'Back to Homepage',
    buttonVote: 'Vote',
    errorVoteFailure: 'Your vote was not accepted .. did you already vote?',
  },
  VoteSessionCreator: {
    bodyBoothAddress: 'Booth address:',
    bodyCurrentNonce: 'Nonce:',
    bodyFestivalChainId: 'Festival ID:',
    bodySelectedArtworks: {
      zero: 'No artwork selected',
      one: 'Selected one artwork',
      other: 'Selected {count} artworks',
    },
    buttonCreateVoteSession: 'Create vote session',
    buttonManualOverride: 'Manual override',
    buttonReset: 'Reset',
    buttonVoteOnBooth: 'Vote here',
    errorInvalidData: 'Inconsistent data to create vote',
    errorUnknownFestivalChainId: 'No know festival connected to this booth',
    notificationAddedArtwork: 'Activated {title}',
    titleAdmin: 'Admin',
    titleStartVote: 'Start vote session',
  },
};

const middlewares = {
  apiError: {
    errorExpiredSession: 'Your session has expired. Please login again.',
  },
};

const store = {
  app: {
    errorTokenFailure: 'Login failed, please try again.',
    notificationTokenSuccess: 'Login successful! Welcome!',
  },
  ethereum: {
    notificationAccountEnabled: 'Activated Smart Contracts Snuggle Panel',
  },
};

const views = {
  Admin: {
    title: 'Admin',
    titleNavigation: 'Navigation',
    linkAdminArtists: 'Artists',
    linkAdminArtworks: 'Artworks',
    linkAdminBooths: 'Booths',
    linkAdminDashboard: 'Dashboard',
    linkAdminFestivals: 'Festivals',
    linkAdminProperties: 'Properties',
    linkAdminQuestions: 'Questions',
    linkAdminUsers: 'Users',
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
  AdminBooths: {
    fieldAddress: 'Address',
    fieldFestival: 'Festival',
    fieldAction: 'Deactivate',
    title: 'Voting Booths',
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
    title: 'Questions',
  },
  AdminQuestionsNew: {
    title: 'Create new question',
    notificationSuccess: 'You created the question {title}.',
  },
  AdminQuestionsEdit: {
    bodyAnswers: 'Answers',
    buttonNewAnswer: 'Add a new answer to this question',
    errorNotFound: 'This question does not exist.',
    notificationDestroySuccess: 'You deleted the question {title}.',
    notificationSuccess: 'You updated the question {title}.',
    title: 'Edit question',
  },
  AdminAnswersNew: {
    fieldArtwork: 'Artwork:',
    fieldArtworkPlaceholder: 'Search for artwork to select',
    fieldProperty: 'Property:',
    fieldPropertyPlaceholder: 'Search for property to select',
    notificationSuccess: 'You created a new answer.',
    title: 'Create new answer',
  },
  AdminAnswersEdit: {
    title: 'Edit answer',
  },
  AdminProperties: {
    buttonNewProperty: 'Create new property',
    fieldTitle: 'Property',
    title: 'Properties',
  },
  AdminPropertiesNew: {
    title: 'Create new property',
    notificationSuccess: 'You created the property {title}.',
  },
  AdminPropertiesEdit: {
    errorNotFound: 'This property does not exist.',
    notificationDestroySuccess: 'You deleted the property {title}.',
    notificationSuccess: 'You edited the property {title}.',
    title: 'Edit property',
  },
  AdminArtworks: {
    buttonNewArtwork: 'Create new artwork',
    fieldTitle: 'Title',
    title: 'Artworks',
  },
  AdminArtworksNew: {
    notificationSuccess: 'You created the artwork {title}.',
    title: 'Create new artwork',
  },
  AdminArtworksEdit: {
    errorNotFound: 'This artwork does not exist.',
    notificationDestroySuccess: 'You deleted the artwork {title}.',
    notificationSuccess: 'You edited the artwork {title}.',
    title: 'Edit artwork',
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
    errorNotFound: 'This artist does not exist.',
    notificationDestroySuccess: 'You deleted the artist {name}.',
    notificationSuccess: 'You edited the artist {name}.',
    title: 'Edit artist',
  },
  ArtworksProfile: {
    buttonBackToFestival: 'Back to festival',
    titleArtistDescription: 'Artist bio',
    titleArtworkDescription: 'Artwork description',
  },
  Homepage: {
    bodyIntroduction:
      'CultureStake connects communities, artists and cultural organisations through playful collective decision-making.',
    bodyIntroductionSecondary:
      'Any cultural entity can set up a vote using the app and consult closely with the communities most impacted by their work. For example a city council might need to find out which new artwork should occupy a recently vacated public plinth. Or an arts organisation might need to know which artist on their shortlist should be next summer’s blockbuster.',
    bodyIntroductionThird:
      'The app can be used for in-person or online voting events that provide tasters for larger projects. People vote on the ones most meaningful to them and where they live, while arts organisations go on to commission them at scale - with support from CultureStake producers Furtherfield.',
    bodyIntroductionFourth:
      'CultureStake puts people and places at the centre of cultural programming.',
    bodyStatisticsArtists: 'Artists',
    bodyStatisticsArtworks: 'Artworks',
    bodyStatisticsFestivals: 'Festivals',
    buttonViewFestivals: 'View Festivals',
    buttonFurtherfield: 'Find out more about Furtherfield',
  },
  NotFound: {
    title: 'Not Found',
  },
  Vote: {
    errorScannerFailure: 'Something went wrong with your camera',
    errorInvalidVoteData: 'QR Code is invalid',
  },
};

export default {
  title: 'Culture Stake',
  default: {
    areYouSure: 'Are you sure you really want to do this?',
    buttonDestroy: 'Delete',
    buttonLoadMore: 'Load more',
    buttonReturnToDashboard: 'Return to dashboard',
    buttonReturnToOverview: 'Return to overview',
    buttonSubmitEdit: 'Save',
    buttonSubmitNew: 'Create',
    errorMessage: 'Something went wrong ...',
    legendVote: 'Vote',
    legendVotes: 'Votes',
    tableActionDestroy: 'Delete',
    tableActionEdit: 'Edit',
  },
  validations: {
    artistRequired: 'is required',
    artworkRequired: 'is required',
    consentRequired: 'is required to be checked',
    festivalRequired: 'is required',
    propertyRequired: 'is required',
  },
  ...components,
  ...middlewares,
  ...store,
  ...views,
};
