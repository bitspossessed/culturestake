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
    errorNotInitialized: 'Festival must be initialized',
    title: 'Add New Voting Booth',
  },
  ContractsEmailSigner: {
    addressLabel: 'Booth address:',
    buttonAddNewBooth: 'Create New Voting Booth',
    buttonBurnBooth: 'Delete Booth',
    buttonInitializeBooth: 'Initialize',
    fieldBoothAddress: 'Booth Address:',
    fieldFestivalChainId: 'Festival:',
    fieldFestivalPlaceholder: 'Choose a festival',
    errorNotInitialized: 'Festival must be initialized',
    startTitle: 'Add New Voting Booth',
    finishTitle: 'Booth is ready',
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
  ExportVotesContainer: {
    title: 'Export Votes',
    buttonDownload: 'Download votes as a CSV',
    csvEmpty: 'No votes available to export.',
  },
  FormAnswers: {
    notificationPropertySuccess: 'Created property {title}',
  },
  FormInvitations: {
    fieldEmail: 'Your Email-address:',
  },
  FestivalQuestionsContainer: {
    title: 'Questions',
    buttonNew: 'Create question',
  },
  FormLogin: {
    fieldEmail: 'Your Email-address:',
    fieldPassword: 'Your password:',
  },
  FormFestivals: {
    fieldDescription: 'Description:',
    fieldDocuments: 'Documents',
    fieldImages: 'Images',
    fieldOnline: 'Online',
    fieldSticker: 'Sticker',
    fieldSubtitle: 'Subtitle',
    fieldTitle: 'Title:',
    fieldQuestion: 'Question:',
    fieldArtworks: 'Artworks:',
    fieldUrl: 'Website:',
    fieldThankyouUrl: 'Custom thank you link:',
    buttonEditQuestion: 'Manage',
  },
  FormScheduleEmail: {
    fieldRecipients: 'Recipients:',
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
    fieldDescription: 'Activity Description:',
    fieldDescriptionCommission: 'Commission Description:',
    fieldDocuments: 'Documents',
    fieldImages: 'Artwork images',
    fieldSticker: 'Sticker',
    fieldTitle: 'Title:',
    fieldSubtitle: 'Subtitle',
    fieldUrl: 'Website:',
    fieldImageCredits: 'Image Credits:',
  },
  FormArtists: {
    fieldBio: 'Bio:',
    fieldConsentToDataReveal: 'Consent to data reveal:',
    fieldImages: 'Artist images',
    fieldName: 'Name:',
    fieldUrl: 'Website:',
  },
  FormOrganisations: {
    fieldDescription: 'Description:',
    fieldName: 'Name:',
    fieldImages: 'Organisation logo',
  },
  FormVoteweights: {
    fieldType: 'Type:',
    fieldName: 'Name:',
    fieldMultiplier: 'Multiplier:',
    fieldLatitude: 'Latitude:',
    fieldLongitude: 'Longitude:',
    fieldRadius: 'Radius in km:',
    fieldHotspot: 'Hotspot Address:',
    fieldOrganisation: 'Organisation:',
    fieldOrganisationPlaceholder: 'Search for an organisation to add',
  },
  InputArtworksField: {
    fieldArtwork: 'Artwork:',
    fieldArtworkPlaceholder: 'Search for artwork to add',
    fieldArtworkPrompt: 'Add artwork',
  },
  InputUploadField: {
    buttonRemoveFile: 'Remove',
    buttonSelectFile: 'Select file',
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
    linkAdminOrganisations: 'Organisations',
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
  RemoteVote: {
    errorNotFound: 'Invalid or expired vote link',
    errorInvalidVoteData: 'Invalid vote data',
    notFoundTitle: 'Not Found',
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
    answerAlreadyDeactivated: 'Deactivated',
    buttonDeactivateAnswer: 'Deactivate',
    buttonInitializeAnswer: 'Initialize',
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
    buttonThankyou: 'Click here to try on our thank you instagram filter!',
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
    errorUnknownFestivalChainId: 'No known festival connected to this booth',
    notificationAddedArtwork: 'Activated {title}',
    titleAdmin: 'Admin',
    titleStartVote: 'Start vote session',
  },
  VoteweightsContainer: {
    title: 'Vote weights',
    buttonNewVoteweight: 'Add a new vote weight to this festival',
  },
  VoteweightsTable: {
    buttonDelete: 'Delete',
    fieldType: 'Type',
    fieldName: 'Name',
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
    notificationAccountFailure:
      'Failed to activate Smart Contracts Snuggle Panel',
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
    linkAdminOrganisations: 'Organisations',
    linkAdminProperties: 'Properties',
    linkAdminQuestions: 'Questions',
    linkAdminUsers: 'Users',
    linkAdminEmails: 'Schedule Invitations',
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
  AdminFestivalQuestionsNew: {
    title: 'Create new question for {festival}',
    notificationSuccess: 'You created the question {title} for {festival}.',
  },
  AdminFestivalQuestionsEdit: {
    title: 'Edit question for {festival}',
    notificationSuccess: 'You updated the question {title} for {festival}.',
    bodyAnswers: 'Answers',
    buttonNewAnswer: 'Add a new answer to this question',
    errorNotFound: 'This question does not exist.',
    notificationDestroySuccess:
      'You deleted the question {title} for {festival}.',
  },
  AdminQuestions: {
    buttonNewQuestion: 'Create new question',
    fieldFestival: 'Festival',
    fieldTitle: 'Title',
    title: 'Questions',
  },
  AdminEmails: {
    copy: `After setting up a booth, you can add recipients in the text box below, one email per line.`,
    copyUpload: `Or, upload a text file containing email addresses, again one email per line. Optionally, you can use the first line of the file as a header. For example this is a valid file to upload:`,
    example: `Emails
aaa@example.org
bbb@example.org
ccc@example.org`,
    buttonSendEmails: 'Schedule Emails',
    fieldOrganisationPlaceholder: 'Organisation',
    fieldOrganisationId: 'Search for an organisation',
    title: 'Schedule Email',
    notificationSuccess: 'Scheduled {amount} emails.',
    fileUpload: 'Drag a file with recipients here or click to select.',
    errorUnknownFestivalChainId: 'No known festival connected to this booth',
    errorInvalidData: 'Invalid data: festival question and answers must exist',
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
    buttonNewArtist: 'Create new artist',
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
  AdminOrganisations: {
    buttonNewOrganisation: 'Create new organisation',
    fieldName: 'Name',
    title: 'Organisations',
  },
  AdminOrganisationsNew: {
    title: 'Create new organisation',
    notificationSuccess: 'You created the organisation {name}.',
  },
  AdminOrganisationsEdit: {
    errorNotFound: 'This organisation does not exist.',
    notificationDestroySuccess: 'You deleted the organisation {name}.',
    notificationSuccess: 'You edited the organisation {name}.',
    title: 'Edit organisation',
  },
  AdminVoteweightsNew: {
    notificationSuccess: 'You created a new vote weight.',
    title: 'Create new vote weight',
  },
  AdminVoteweightsView: {
    errorNotFound: 'This voteweight does not exist.',
    notificationDestroySuccess: 'You deleted the voteweight {name}.',
    title: 'View vote weight',
    buttonBackToFestival: 'Back to festival.',
  },
  Artworks: {
    buttonBackToFestival: 'Back to festival',
  },
  ArtworksProfile: {
    buttonBackToFestival: 'Back to festival',
    buttonBackToFestivalArtworks: 'Back to artworks',
    buttonGoToArtistWebsite: 'Visit artist website',
    buttonGoToArtworkWebsite: 'Visit artwork website',
    titleArtistDescription: 'Artist bio',
    titleArtworkDescription: 'Artwork activity description',
    titleArtworkDescriptionCommission: 'Artwork commission description',
  },
  FestivalsProfile: {
    buttonGoToWebsite: 'Visit festival website',
    buttonShowAllArtworks: 'Show festival artworks',
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
  Invitations: {
    buttonSubmit: 'Begin voting',
    notificationSuccess:
      'We just sent you an unique vote link, please check your email!',
    title: 'Welcome to Culturestake!',
    locationDescription:
      'The vote page will request your location because votes are weighted by the localities they are placed from. You are free to deny location access, your vote will still be processed.',
  },
  NotFound: {
    title: 'Not Found',
  },
  Vote: {
    errorScannerFailure: 'Something went wrong with your camera',
    errorInvalidVoteData: 'QR Code is invalid',
  },
  HotspotVote: {
    errorNotEnabled: 'This features is not enabled',
    errorInvalidVoteData: 'Invalid vote data',
    errorAlreadyVoted: 'You already voted!',
    notEnabled: 'Unauthorized',
  },
};

export default {
  title: 'Culture Stake',
  default: {
    areYouSure: 'Are you sure you really want to do this?',
    buttonDestroy: 'Delete',
    buttonView: 'View',
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
    tableActionView: 'View',
  },
  validations: {
    artistRequired: 'is required',
    artworkRequired: 'is required',
    consentRequired: 'is required to be checked',
    festivalRequired: 'is required',
    propertyRequired: 'is required',
    organisationRequired: 'is required',
  },
  ...components,
  ...middlewares,
  ...store,
  ...views,
};
