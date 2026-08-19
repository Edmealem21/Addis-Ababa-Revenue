import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  am: {
    // App & Header
    appTitle: 'የአዲስ አበባ ከተማ አስተዳደር ገቢዎች ቢሮ',
    navMenu: 'የአሰሳ ምናሌ',
    dashboard: 'ዳሽቦርድ',
    taxCenter: 'ታክስ ማእከል',
    ictAdmin: 'የአይቲ አስተዳዳሪ',
    employeeData: 'የሰራተኛ መረጃ',
    userData: 'የተጠቃሚ መረጃ',
    bankAccounts: 'የባንክ መለያዎች',
    taxPayers: 'ግብር ከፋዮች',
    taxNotifies: 'የታክስ ማሳወቂያዎች',
    unevaluated: 'ያልተገመገመ',
    allNotifies: 'ሁሉም ማሳወቂያዎች',
    employees: 'ሰራተኞች',
    authority: 'ባለስልጣን',
    officer: 'ኦፊሰር',
    
    // Header Actions & Profile
    personalProfile: 'የግል ማህደር',
    changePassword: 'የይለፍ ቃል ቀይር',
    changeName: 'ሙሉ ስም ቀይር',
    logout: 'ዘግተ ውጣ',
    currentPassword: 'የአሁኑ የይለፍ ቃል',
    newPassword: 'አዲስ የይለፍ ቃል',
    confirmPassword: 'አዲስ የይለፍ ቃል አረጋግጥ',
    newFullName: 'አዲስ ሙሉ ስም',
    save: 'ያስቀምጡ',
    cancel: 'ሰርዝ',
    saving: 'በመቀየር ላይ...',
    vatExpert: 'የተጨማሪ እሴት ታክስ ባለሙያ',
    admin: 'አስተዳዳሪ',

    // Login
    loginTitle: 'እንኳን በደህና መጡ',
    loginSubtitle: 'ወደ ገቢዎች አስተዳደር ስርዓት ለመግባት መረጃዎን ያስገቡ',
    username: 'ተጠቃሚ ስም',
    usernamePlaceholder: '👤 ተጠቃሚ ስም ያስገቡ',
    password: 'የይለፍ ቃል',
    passwordPlaceholder: '🔒 የይለፍ ቃል ያስገቡ',
    loginBtn: 'ግባ',
    loggingIn: 'እባክዎ ይጠብቁ...',
    demoAccounts: 'ተግባራዊ መግቢያዎች (Demo Accounts):',
    loginError: 'የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል አስገብተዋል!',
    footerText: 'የአዲስ አበባ ከተማ አስተዳደር ገቢዎብ',

    // Toggle tooltips & buttons
    switchToDark: 'ወደ ጨለማ ሁነታ ቀይር',
    switchToLight: 'ወደ ብርሃን ሁነታ ቀይር',
    language: 'ቋንቋ',
    amharic: 'አማርኛ',
    english: 'English',

    // Common Table & UI
    search: 'ፈልግ...',
    totalCount: 'ጠቅላላ ብዛት',
    perPage: 'በአንድ ገጽ',
    actions: 'ድርጊቶች',
    status: 'ሁኔታ',
    active: 'ንቁ',
    inactive: 'ኢ-ንቁ',
    edit: 'አርትዕ',
    delete: 'ሰርዝ',
    view: 'ተመልከት',
    add: 'አዲስ አክል',
    fullName: 'ሙሉ ስም',
    idNumber: 'መለያ ቁጥር',
    jobCategory: 'የስራ መደብ',
    createdAt: 'የተመዘገበበት ቀን',
    updatedAt: 'የተሻሻለበት ቀን',

    // Additional translation keys
    addRecord: 'አዲስ መዝገብ',
    taxPayerName: 'የግብር ከፋይ ስም',
    tinNumber: 'የግብር ከፋይ መለያ ቁጥር',
    phoneNumber: 'ስልክ ቁጥር',
    orgType: 'የ ድርጅቱ አይነት',
    bankName: 'የባንክ ስም',
    accountNumber: 'የሂሳብ ቁጥር',
    accountOwner: 'የሂሳብ ባለቤት',
    branch: 'ቅርንጫፍ',
    startDate: 'የመጀመሪያ ቀን',
    endDate: 'የመጨረሻ ቀን',
    receiver: 'ተቀባይ',
    pending: 'በመጠባበቅ ላይ',
    approved: 'ተቀባይነት አግኝቷል',
    rejected: 'ውድቅ ተደርጓል',
    warning: 'ማስጠንቀቂያ',
    confirmDelete: 'እርግጠኛ ነዎት መሰረዝ ይፈልጋሉ?',
    createAccount: 'መለያ ይፍጠሩ',
    accountCreated: 'የተጠቃሚ መለያ ተፈጥሯል',
    accountCreatedTooltip: 'ለዚህ ሰራተኛ አስቀድሞ የተጠቃሚ መለያ ተፈጥሯል።',
    deleteAccount: 'መለያ ሰርዝ',
    role: 'ሚና',
    address: 'አድራሻ',
    code: 'ኮድ',
    yes: 'አዎ',
    no: 'አይ',
    welcome: 'እንኳን በደህና መጡ!',
    display: 'አሳይ',
    listsPerPage: 'በአንድ ገጽ ዝርዝሮች',
    dataPer: 'በአንድ ገጽ የመረጃ ብዛት',
    searchLabel: 'ፈልግ:',
    searchPlaceholder: 'ፈልግ...',
    searchTaxpayerPlaceholder: 'በስም, TIN, ወይም ተቀባይ ፈልግ...',
    searchTaxpayerHint: '🔍 በግብር ከፋይ ስም፣ ታክስ መለያ ቁጥር ወይም በስልክ ቁጥር ፈልግ ወይም አዲስ መዝግብ',
    registerNew: 'አዲስ ይመዝገቡ',
    saveChanges: 'ለውጦችን መዝግብ',
    close: 'ዝጋ',
    registering: 'በመመዝገብ ላይ...',
    details: 'ዝርዝር መረጃ',
    total: 'ጠቅላላ',
    users: 'ተጠቃሚዎች',
    first: 'መጀመሪያ',
    previous: 'ቀዳሚ',
    next: 'ቀጣይ',
    last: 'መጨረሻ',
    showing: 'የሚታየው',
    to: 'እስከ',
    of: 'ከ',
    page: 'ገጽ',
    taxPayersTitle: '🧾 ግብር ከፋዮች',
    bankAccountsTitle: '🏦 የባንክ መለያዎች',
    employeeDataTitle: '👥 የሰራተኛ መረጃ',
    userDataTitle: '👤 የተጠቃሚ መረጃ',
    unevaluatedTitle: '📋 ያልተገመገመ',
    allNotifiesTitle: '📨 ሁሉም ማሳወቂያዎች',
    taxCentersTitle: '🏢 የታክስ ማእከላት',
    ictAdminNav: 'የአይሲቲ አስተዳደር',
    newTaxPayer: 'አዲስ ግብር ከፋይ',
    noData: 'መረጃ የለም',
    mrc: 'የሽያጭ መለያ ኮድ (MRC)',
    turnoverTax: 'የታክስ መጠን (Turnover Tax)',
    subIdentity: 'የንዑስ መለያ ቁጥር',
    jobType: 'የሥራ ዓይነት',
    select: '-- ይምረጡ --',
    isActiveQuestion: 'ንቁ ነው?',
  },
  en: {
    // App & Header
    appTitle: 'Addis Ababa Revenue Bureau System',
    navMenu: 'Navigation Menu',
    dashboard: 'Dashboard',
    taxCenter: 'Tax Center',
    ictAdmin: 'ICT Administrator',
    employeeData: 'Employee Data',
    userData: 'User Data',
    bankAccounts: 'Bank Accounts',
    taxPayers: 'Tax Payers',
    taxNotifies: 'Tax Notifications',
    unevaluated: 'Unevaluated',
    allNotifies: 'All Notifications',
    employees: 'Employees',
    authority: 'Authority',
    officer: 'Officer',

    // Header Actions & Profile
    personalProfile: 'Profile',
    changePassword: 'Change Password',
    changeName: 'Change Name',
    logout: 'Logout',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    newFullName: 'New Full Name',
    save: 'Save',
    cancel: 'Cancel',
    saving: 'Saving...',
    vatExpert: 'VAT Specialist',
    admin: 'Administrator',

    // Login
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Enter your credentials to access the VAT Revenue System',
    username: 'Username',
    usernamePlaceholder: '👤 Enter username',
    password: 'Password',
    passwordPlaceholder: '🔒 Enter password',
    loginBtn: 'Sign In',
    loggingIn: 'Please wait...',
    demoAccounts: 'Demo Accounts:',
    loginError: 'Invalid username or password!',
    footerText: 'Addis Ababa City Administration Revenues Bureau',

    // Toggle tooltips & buttons
    switchToDark: 'Switch to Dark Mode',
    switchToLight: 'Switch to Light Mode',
    language: 'Language',
    amharic: 'አማርኛ',
    english: 'English',

    // Common Table & UI
    search: 'Search...',
    totalCount: 'Total Count',
    perPage: 'per page',
    actions: 'Actions',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    add: 'Add New',
    fullName: 'Full Name',
    idNumber: 'ID Number',
    jobCategory: 'Job Category',
    createdAt: 'Created At',
    updatedAt: 'Updated At',

    // Additional translation keys
    addRecord: 'Add Record',
    taxPayerName: 'Tax Payer Name',
    tinNumber: 'TIN Number',
    phoneNumber: 'Phone Number',
    orgType: 'Organization Type',
    bankName: 'Bank Name',
    accountNumber: 'Account Number',
    accountOwner: 'Account Owner',
    branch: 'Branch',
    startDate: 'Start Date',
    endDate: 'End Date',
    receiver: 'Receiver',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    warning: 'Warning',
    confirmDelete: 'Are you sure you want to delete?',
    createAccount: 'Create Account',
    accountCreated: 'Account Created',
    accountCreatedTooltip: 'A user account has already been created for this employee.',
    deleteAccount: 'Delete Account',
    role: 'Role',
    address: 'Address',
    code: 'Code',
    yes: 'Yes',
    no: 'No',
    welcome: 'Welcome!',
    display: 'Display',
    listsPerPage: 'lists per page',
    dataPer: 'Data per page',
    searchLabel: 'Search:',
    searchPlaceholder: 'Search...',
    searchTaxpayerPlaceholder: 'Search by name, TIN, or receiver...',
    searchTaxpayerHint: '🔍 Search by tax payer name, tax identity number, or phone number or register new tax payer',
    registerNew: 'Register New',
    saveChanges: 'Save Changes',
    close: 'Close',
    registering: 'Registering...',
    details: 'Details',
    total: 'Total',
    users: 'users',
    first: 'First',
    previous: 'Previous',
    next: 'Next',
    last: 'Last',
    showing: 'Showing',
    to: 'to',
    of: 'of',
    page: 'Page',
    taxPayersTitle: '🧾 Tax Payers',
    bankAccountsTitle: '🏦 Bank Accounts',
    employeeDataTitle: '👥 Employee Data',
    userDataTitle: '👤 User Data',
    unevaluatedTitle: '📋 Unevaluated',
    allNotifiesTitle: '📨 All Notifications',
    taxCentersTitle: '🏢 Tax Centers',
    ictAdminNav: 'ICT Administration',
    newTaxPayer: 'New Tax Payer',
    noData: 'DATA NOT AVAILABLE',
    mrc: 'Sales Identity Code (MRC)',
    turnoverTax: 'Turnover Tax',
    subIdentity: 'Sub Identity Number',
    jobType: 'Job Type',
    select: '-- Select --',
    isActiveQuestion: 'Is Active?',
  }
};

const amharicToEnglishMap = {
  'ሀ': 'ha', 'ሁ': 'hu', 'ሂ': 'hi', 'ሃ': 'ha', 'ሄ': 'he', 'ህ': 'h', 'ሆ': 'ho',
  'ሐ': 'ha', 'ሑ': 'hu', 'ሒ': 'hi', 'ሓ': 'ha', 'ሔ': 'he', 'ሕ': 'h', 'ሖ': 'ho',
  'ኀ': 'ha', 'ኁ': 'hu', 'ኂ': 'hi', 'ኃ': 'ha', 'ኄ': 'he', 'ኅ': 'h', 'ኆ': 'ho',
  'ለ': 'le', 'ሉ': 'lu', 'ሊ': 'li', 'ላ': 'la', 'ሌ': 'le', 'ል': 'l', 'ሎ': 'lo',
  'መ': 'me', 'ሙ': 'mu', 'ሚ': 'mi', 'ማ': 'ma', 'ሜ': 'me', 'ም': 'm', 'ሞ': 'mo',
  'ሠ': 'se', 'ሡ': 'su', 'ሢ': 'si', 'ሣ': 'sa', 'ሤ': 'se', 'ሥ': 's', 'ሦ': 'so',
  'ሰ': 'se', 'ሱ': 'su', 'ሲ': 'si', 'ሳ': 'sa', 'ሴ': 'se', 'ስ': 's', 'ሶ': 'so',
  'ረ': 're', 'ሩ': 'ru', 'ሪ': 'ri', 'ራ': 'ra', 'ሬ': 're', 'ር': 'r', 'ሮ': 'ro',
  'ሸ': 'she', 'ሹ': 'shu', 'ሺ': 'shi', 'ሻ': 'sha', 'ሼ': 'she', 'ሽ': 'sh', 'ሾ': 'sho',
  'ቀ': 'qe', 'ቁ': 'qu', 'ቂ': 'qi', 'ቃ': 'qa', 'ቄ': 'qe', 'ቅ': 'q', 'ቆ': 'qo',
  'በ': 'be', 'ቡ': 'bu', 'ቢ': 'bi', 'ባ': 'ba', 'ቤ': 'be', 'ብ': 'b', 'ቦ': 'bo',
  'ተ': 'te', 'ቱ': 'tu', 'ቲ': 'ti', 'ታ': 'ta', 'ቴ': 'te', 'ት': 't', 'ቶ': 'to',
  'ቸ': 'che', 'ቹ': 'chu', 'ቺ': 'chi', 'ቻ': 'cha', 'ቼ': 'che', 'ች': 'ch', 'ቾ': 'cho',
  'ነ': 'ne', 'ኑ': 'nu', 'ኒ': 'ni', 'ና': 'na', 'ኔ': 'ne', 'ን': 'n', 'ኖ': 'no',
  'ኘ': 'nye', 'ኙ': 'nyu', 'ኚ': 'nyi', 'ኛ': 'nya', 'ኜ': 'nye', 'ኝ': 'ny', 'ኞ': 'nyo',
  'አ': 'a', 'ኡ': 'u', 'ኢ': 'i', 'ኣ': 'a', 'ኤ': 'e', 'እ': 'e', 'ኦ': 'o',
  'ዐ': 'a', 'ዑ': 'u', 'ዒ': 'i', 'ዓ': 'a', 'ዔ': 'e', 'ዕ': 'e', 'ዖ': 'o',
  'ከ': 'ke', 'ኩ': 'ku', 'ኪ': 'ki', 'ካ': 'ka', 'ኬ': 'ke', 'ክ': 'k', 'ኮ': 'ko',
  'ኸ': 'khe', 'ኹ': 'khu', 'ኺ': 'khi', 'ኻ': 'kha', 'ኼ': 'khe', 'ኽ': 'kh', 'ኾ': 'kho',
  'ወ': 'we', 'ዉ': 'wu', 'ዊ': 'wi', 'ዋ': 'wa', 'ዌ': 'we', 'ው': 'w', 'ዎ': 'wo',
  'ዘ': 'ze', 'ዙ': 'zu', 'ዚ': 'zi', 'ዛ': 'za', 'ዜ': 'ze', 'ዝ': 'z', 'ዞ': 'zo',
  'ዠ': 'zhe', 'ዡ': 'zhu', 'ዢ': 'zhi', 'ዣ': 'zha', 'ዤ': 'zhe', 'ዥ': 'zh', 'ዦ': 'zho',
  'የ': 'ye', 'ዩ': 'yu', 'ዪ': 'yi', 'ያ': 'ya', 'ዬ': 'ye', 'ይ': 'y', 'ዮ': 'yo',
  'ደ': 'de', 'ዱ': 'du', 'ዲ': 'di', 'ዳ': 'da', 'ዴ': 'de', 'ድ': 'd', 'ዶ': 'do',
  'ጀ': 'je', 'ጁ': 'ju', 'ጂ': 'ji', 'ጃ': 'ja', 'ጄ': 'je', 'ጅ': 'j', 'ጆ': 'jo',
  'ገ': 'ge', 'ጉ': 'gu', 'ጊ': 'gi', 'ጋ': 'ga', 'ጌ': 'ge', 'ግ': 'g', 'ጎ': 'go',
  'ጠ': 'te', 'ጡ': 'tu', 'ጢ': 'ti', 'ጣ': 'ta', 'ጤ': 'te', 'ጥ': 't', 'ጦ': 'to',
  'ጨ': 'che', 'ጩ': 'chu', 'ጪ': 'chi', 'ጫ': 'cha', 'ጬ': 'che', 'ጭ': 'ch', 'ጮ': 'cho',
  'ጰ': 'pe', 'ጱ': 'pu', 'ጲ': 'pi', 'ጳ': 'pa', 'ጴ': 'pe', 'ጵ': 'p', 'ጶ': 'po',
  'ጸ': 'tse', 'ጹ': 'tsu', 'ጺ': 'tsi', 'ጻ': 'tsa', 'ጼ': 'tse', 'ጽ': 'ts', 'ጾ': 'tso',
  'ፀ': 'tse', 'ፁ': 'tsu', 'ፂ': 'tsi', 'ፃ': 'tsa', 'ፄ': 'tse', 'ፅ': 'ts', 'ፆ': 'tso',
  'ፈ': 'fe', 'ፉ': 'fu', 'ፊ': 'fi', 'ፋ': 'fa', 'ፌ': 'fe', 'ፍ': 'f', 'ፎ': 'fo',
  'ፐ': 'pe', 'ፑ': 'pu', 'ፒ': 'pi', 'ፓ': 'pa', 'ፔ': 'pe', 'ፕ': 'p', 'ፖ': 'po',
};

const dataTranslations = {
  // Names
  'አስቴር አለሙ': 'Aster Alemu',
  'Aster Alemu': 'አስቴር አለሙ',
  'ተስፋዬ መኮንን': 'Tesfaye Mekonnen',
  'Tesfaye Mekonnen': 'ተስፋዬ መኮንን',
  'አብይ አህመድ': 'Abiy Ahmed',
  'Abiy Ahmed': 'አብይ አህመድ',
  'ሰላም አበበ': 'Selam Abebe',
  'Selam Abebe': 'ሰላም አበበ',
  'ዳዊት ሀይለማርያም': 'Dawit Hailemariam',
  'Dawit Hailemariam': 'ዳዊት ሀይለማርያም',
  'ሄለን ገብረእግዚአብሔር': 'Helen Gebreigziabher',
  'Helen Gebreigziabher': 'ሄለን ገብረእግዚአብሔር',
  'ማርያም በቀለ': 'Mariam Bekele',
  'Mariam Bekele': 'ማርያም በቀለ',
  'ሳሙኤል ተስፋዬ': 'Samuel Tesfaye',
  'Samuel Tesfaye': 'ሳሙኤል ተስፋዬ',
  'አብልሃም አበበ': 'Abraham Abebe',
  'Abraham Abebe': 'አብልሃም አበበ',
  'አብረሃም አስፋው': 'Abraham Asfaw',
  'Abraham Asfaw': 'አብረሃም አስፋው',
  'ሳራ ተስፋዬ': 'Sara Tesfaye',
  'Sara Tesfaye': 'ሳራ ተስፋዬ',
  'ዳንኤል መኮንን': 'Daniel Mekonnen',
  'Daniel Mekonnen': 'ዳንኤል መኮንን',

  // Tax Centers
  'አዲስ አበባ ቅዱስ ጊዮርጊስ': 'Addis Ababa Saint George',
  'Addis Ababa Saint George': 'አዲስ አበባ ቅዱስ ጊዮርጊስ',
  'አዲስ አበባ ቦሌ': 'Addis Ababa Bole',
  'Addis Ababa Bole': 'አዲስ አበባ ቦሌ',
  'አዲስ አበባ መኩሪያ': 'Addis Ababa Mekuria',
  'Addis Ababa Mekuria': 'አዲስ አበባ መኩሪያ',
  'አዲስ አበባ ሳሪስ': 'Addis Ababa Saris',
  'Addis Ababa Saris': 'አዲስ አበባ ሳሪስ',
  'አዲስ አበባ ካዛንቺስ': 'Addis Ababa Kazanchis',
  'Addis Ababa Kazanchis': 'አዲስ አበባ ካዛንቺስ',
  'አዲስ አበባ ላፍቶ': 'Addis Ababa Lafto',
  'Addis Ababa Lafto': 'አዲስ አበባ ላፍቶ',
  'አዲስ አበባ ጉለሌ': 'Addis Ababa Gulele',
  'Addis Ababa Gulele': 'አዲስ አበባ ጉለሌ',
  'አዲስ አበባ ቀላም': 'Addis Ababa Kelam',
  'Addis Ababa Kelam': 'አዲስ አበባ ቀላም',
  'አዲስ አበባ': 'Addis Ababa',
  'Addis Ababa': 'አዲስ አበባ',
  'ባህር ዳር': 'Bahir Dar',
  'Bahir Dar': 'ባህር ዳር',
  'ጎንደር': 'Gonder',
  'Gonder': 'ጎንደር',

  // Addresses
  'ቅዱስ ጊዮርጊስ አደባባይ': 'Saint George Square',
  'Saint George Square': 'ቅዱስ ጊዮርጊስ አደባባይ',
  'ቦሌ መዳፍ ቀዳማዊ': 'Bole Medaf Kedamawi',
  'Bole Medaf Kedamawi': 'ቦሌ መዳፍ ቀዳማዊ',
  'መኩሪያ አካባቢ': 'Mekuria Area',
  'Mekuria Area': 'መኩሪያ አካባቢ',
  'ሳሪስ አደባባይ': 'Saris Square',
  'Saris Square': 'ሳሪስ አደባባይ',
  'ካዛንቺስ አደባባይ': 'Kazanchis Square',
  'Kazanchis Square': 'ካዛንቺስ አደባባይ',
  'ላፍቶ አደባባይ': 'Lafto Square',
  'Lafto Square': 'ላፍቶ አደባባይ',
  'ጉለሌ አደባባይ': 'Gulele Square',
  'Gulele Square': 'ጉለሌ አደባባይ',
  'ቀላም አደባባይ': 'Kelam Square',
  'Kelam Square': 'ቀላም አደባባይ',

  // Bank Names & Branches
  'አዲስ ባንክ': 'Addis Bank',
  'Addis Bank': 'አዲስ ባንክ',
  'ኢትዮጵያ ንግድ ባንክ': 'Commercial Bank of Ethiopia',
  'Commercial Bank of Ethiopia': 'ኢትዮጵያ ንግድ ባንክ',
  'ቅዱስ ጊዮርጊስ': 'Saint George',
  'Saint George': 'ቅዱስ ጊዮርጊስ',
  'ቦሌ': 'Bole',
  'Bole': 'ቦሌ',

  // Organization Types
  'ኩባንያ': 'Company',
  'Company': 'ኩባንያ',
  'ኅላፊነቱ የተወሰነ ይግል ማህበር': 'Private Limited Company',
  'Private Limited Company': 'ኅላፊነቱ የተወሰነ ይግል ማህበር',
  'ህብረት ስራ': 'Cooperative',
  'Cooperative': 'ህብረት ስራ',
  'ሽርክና': 'Partnership',
  'Partnership': 'ሽርክና',
  'አክሲዎን': 'Share Company',
  'Share Company': 'አክሲዎን',
  'ክልላዊ': 'Regional',
  'Regional': 'ክልላዊ',
  'NGO': 'NGO',
  'የግል': 'Personal',
  'Personal': 'የግል',

  // Statuses & Roles
  'ንቁ': 'Active',
  'Active': 'ንቁ',
  'ተቋርጧል': 'Inactive',
  'Inactive': 'ተቋርጧል',
  'ኢ-ንቁ': 'Inactive',
  'በመጠባበቅ ላይ': 'Pending',
  'Pending': 'በመጠባበቅ ላይ',
  'ተቀባይነት አግኝቷል': 'Approved',
  'Approved': 'ተቀባይነት አግኝቷል',
  'ውድቅ ተደርጓል': 'Rejected',
  'Rejected': 'ውድቅ ተደርጓል',
  'Authority': 'ባለስልጣን',
  'ባለስልጣን': 'Authority',
  'ICT Administrator': 'የአይቲ አስተዳዳሪ',
  'የአይቲ አስተዳዳሪ': 'ICT Administrator',
  'Officer': 'ኦፊሰር',
  'ኦፊሰር': 'Officer',
};

const transliterateAmharicToEnglish = (text) => {
  if (!text) return '';
  const result = text.split('').map(char => {
    return amharicToEnglishMap[char] || char;
  }).join('');

  // Capitalize first letter of each word
  return result
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const savedLang = localStorage.getItem('app_language');
  const [language, setLanguage] = useState(savedLang || 'am');

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'am' ? 'en' : 'am';
      localStorage.setItem('app_language', next);
      return next;
    });
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('app_language', lang);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to Amharic if key missing in English, or return key
    if (translations.am[key]) {
      return translations.am[key];
    }
    return key;
  };

  const tData = (text) => {
    if (typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (!trimmed) return text;

    // 1. Direct dictionary match
    if (dataTranslations[trimmed]) {
      return dataTranslations[trimmed];
    }
    if (dataTranslations[text]) {
      return dataTranslations[text];
    }

    // 2. Fallback transliteration
    if (language === 'en') {
      const hasAmharic = /[\u1200-\u137F]/.test(text);
      if (hasAmharic) {
        return transliterateAmharicToEnglish(text);
      }
    } else if (language === 'am') {
      for (const [key, value] of Object.entries(dataTranslations)) {
        if (value.toLowerCase() === text.toLowerCase()) {
          return key;
        }
      }
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, toggleLanguage, t, tData }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
