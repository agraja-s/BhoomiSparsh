export type Language = 'en' | 'mr' | 'hi'

export interface TranslationDictionary {
  appName: string
  appTagline: string
  mockNotice: string
  liveMode: string
  mockMode: string
  startAssessment: string
  recentAssessments: string
  noRecentAssessments: string
  howItWorksTitle: string
  step1Title: string
  step1Desc: string
  step2Title: string
  step2Desc: string
  step3Title: string
  step3Desc: string
  fieldAssessmentTitle: string
  fieldAssessmentSubtitle: string
  cropTypeLabel: string
  growthStageLabel: string
  uploadPhotoLabel: string
  uploadPhotoHelp: string
  dragOrClick: string
  replacePhoto: string
  removePhoto: string
  fieldLocationLabel: string
  useCurrentLocation: string
  fetchingLocation: string
  latitudeLabel: string
  longitudeLabel: string
  observationsLabel: string
  observationsPlaceholder: string
  analyzeButton: string
  analyzingButton: string
  resultsTitle: string
  resultsSubtitle: string
  backToDashboard: string
  cropDiagnosis: string
  candidateDetected: string
  healthyStatus: string
  inconclusiveStatus: string
  confidenceLabel: string
  imageEvidenceLabel: string
  uncertaintyNotesLabel: string
  weatherForecastTitle: string
  currentConditions: string
  temperature: string
  humidity: string
  precipitation: string
  weatherSource: string
  riskTimelineTitle: string
  riskTimelineSubtitle: string
  riskScoreLabel: string
  lowRisk: string
  moderateRisk: string
  highRisk: string
  keyDriversLabel: string
  interventionWindowLabel: string
  advisoryTitle: string
  culturalPracticesTitle: string
  chemicalWarningTitle: string
  recheckScheduleTitle: string
  verifiedSourcesTitle: string
  selectCropPlaceholder: string
  selectStagePlaceholder: string
  validationImageRequired: string
  validationCropRequired: string
  validationStageRequired: string
  validationCoordinatesRequired: string
  retryAssessment: string
  errorOccurred: string
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'AgriSentry',
    appTagline: 'Micro-Climatic Crop Disease Early Warning System',
    mockNotice: 'DEMO DATA — NOT A REAL FARM FORECAST',
    liveMode: 'LIVE BACKEND',
    mockMode: 'DEMO / MOCK MODE',
    startAssessment: 'Start New Crop Assessment',
    recentAssessments: 'Recent Field Assessments',
    noRecentAssessments: 'No prior field assessments recorded.',
    howItWorksTitle: 'How AgriSentry Protects Your Crops',
    step1Title: '1. Crop Photo Inspection',
    step1Desc: 'Upload a clear leaf or canopy photo to identify early symptom patterns.',
    step2Title: '2. Micro-Climate Forecast',
    step2Desc: 'Integrates local temperature and relative humidity predictions from Open-Meteo.',
    step3Title: '3. Predictive Disease Risk',
    step3Desc: 'Models pathogen suitability over time, avoiding unnecessary chemical spraying.',
    fieldAssessmentTitle: 'New Field Assessment',
    fieldAssessmentSubtitle: 'Upload a crop leaf photograph and enter field coordinates to generate a predictive risk model.',
    cropTypeLabel: 'Crop Type',
    growthStageLabel: 'Crop Growth Stage',
    uploadPhotoLabel: 'Crop Leaf / Field Photograph',
    uploadPhotoHelp: 'Capture a close-up photo of affected or suspect foliage in good natural lighting (JPEG, PNG, WebP up to 10MB).',
    dragOrClick: 'Tap to capture from camera or choose photo',
    replacePhoto: 'Change Photo',
    removePhoto: 'Remove',
    fieldLocationLabel: 'Field Location Coordinates',
    useCurrentLocation: 'Use GPS Location',
    fetchingLocation: 'Acquiring GPS...',
    latitudeLabel: 'Latitude',
    longitudeLabel: 'Longitude',
    observationsLabel: 'Farmer Observations (Optional)',
    observationsPlaceholder: 'Describe any discoloration, wilting, recent rain, or leaf spots you noticed...',
    analyzeButton: 'Analyze Crop Health',
    analyzingButton: 'Evaluating Crop & Micro-Climate...',
    resultsTitle: 'Early Warning Assessment Report',
    resultsSubtitle: 'Fused diagnosis, local environmental forecast, temporal risk curve, and practical advisories.',
    backToDashboard: 'Back to Dashboard',
    cropDiagnosis: 'Crop & Image Diagnosis',
    candidateDetected: 'Possible Disease Symptoms Detected',
    healthyStatus: 'No Significant Disease Symptoms',
    inconclusiveStatus: 'Inconclusive Image Evidence',
    confidenceLabel: 'Model Confidence',
    imageEvidenceLabel: 'Observed Image Features',
    uncertaintyNotesLabel: 'Diagnostic Notes & Uncertainty',
    weatherForecastTitle: 'Upcoming Micro-Climatic Forecast',
    currentConditions: 'Current Field Conditions',
    temperature: 'Temperature',
    humidity: 'Relative Humidity',
    precipitation: 'Precipitation',
    weatherSource: 'Forecast Source',
    riskTimelineTitle: '48-Hour Disease Risk Progression Timeline',
    riskTimelineSubtitle: 'Estimated environmental suitability curve for fungal & bacterial spore development over time.',
    riskScoreLabel: 'Risk Index (0-100)',
    lowRisk: 'Low Risk',
    moderateRisk: 'Moderate Risk',
    highRisk: 'High Risk',
    keyDriversLabel: 'Key Micro-Climatic Drivers',
    interventionWindowLabel: 'Recommended Monitoring / Action Window',
    advisoryTitle: 'Practical Field Advisory',
    culturalPracticesTitle: 'Immediate Cultural Practices',
    chemicalWarningTitle: 'Pesticide & Chemical Caution',
    recheckScheduleTitle: 'Next Recommended Inspection',
    verifiedSourcesTitle: 'Scientific Guidelines & Sources',
    selectCropPlaceholder: 'Select your crop...',
    selectStagePlaceholder: 'Select growth stage...',
    validationImageRequired: 'Please upload or capture a crop photograph.',
    validationCropRequired: 'Please select the crop type.',
    validationStageRequired: 'Please select the crop growth stage.',
    validationCoordinatesRequired: 'Please enter valid latitude and longitude coordinates.',
    retryAssessment: 'Retry Assessment',
    errorOccurred: 'Assessment Request Failed',
  },
  mr: {
    appName: 'ॲग्रीसेंट्री (AgriSentry)',
    appTagline: 'सूक्ष्म-हवामान पीक रोग पूर्वसूचना प्रणाली',
    mockNotice: 'डेमो माहिती — प्रत्यक्ष शेताचा अंदाज नाही',
    liveMode: 'थेट प्रणाली',
    mockMode: 'डेमो / सराव पद्धत',
    startAssessment: 'नवीन पीक तपासणी सुरू करा',
    recentAssessments: 'नुकतीच झालेली पीक तपासणी',
    noRecentAssessments: 'अजून कोणतीही तपासणी केलेली नाही.',
    howItWorksTitle: 'ॲग्रीसेंट्री पिकांचे रक्षण कसे करते?',
    step1Title: '१. पानांचा फोटो तपासा',
    step1Desc: 'रोगाची प्राथमिक लक्षणे शोधण्यासाठी पानाचा स्पष्ट फोटो अपलोड करा.',
    step2Title: '२. स्थानिक हवामान अंदाज',
    step2Desc: 'पुढील २४ ते ७२ तासांचे तापमान व आर्द्रतेचा स्थानिक अंदाज जोडतो.',
    step3Title: '३. रोग वाढीचा संभाव्य धोका',
    step3Desc: 'वेळेनुसार रोगाचा धोका ओळखून अनावश्यक औषध फवारणी टाळण्यास मदत करतो.',
    fieldAssessmentTitle: 'नवीन शेत पीक तपासणी',
    fieldAssessmentSubtitle: 'पिकाच्या पानाचा फोटो आणि शेताचे स्थान निवडून हवामान आधारित रोग अंदाज मिळवा.',
    cropTypeLabel: 'पीक प्रकार',
    growthStageLabel: 'पिकाची वाढीची अवस्था',
    uploadPhotoLabel: 'पिकाच्या पानाचा फोटो',
    uploadPhotoHelp: 'चांगल्या सूर्यप्रकाशात पानावरील डाग किंवा लक्षणांचा जवळून फोटो काढा (१० MB पर्यंत).',
    dragOrClick: 'कॅमेऱ्याने फोटो काढा किंवा गॅलरीतून निवडा',
    replacePhoto: 'फोटो बदला',
    removePhoto: 'काढून टाका',
    fieldLocationLabel: 'शेताचे स्थान (अक्षांश / रेखांश)',
    useCurrentLocation: 'सध्याचे GPS स्थान वापरा',
    fetchingLocation: 'GPS स्थान शोधत आहे...',
    latitudeLabel: 'अक्षांश (Latitude)',
    longitudeLabel: 'रेखांश (Longitude)',
    observationsLabel: 'शेतकऱ्याची निरीक्षणे (पर्यायी)',
    observationsPlaceholder: 'पानावरील डाग, पिवळेपणा किंवा मागील पावसाची माहिती लिहा...',
    analyzeButton: 'पीक आरोग्याची तपासणी करा',
    analyzingButton: 'फोटो व हवामानाचे विश्लेषण करत आहे...',
    resultsTitle: 'पीक रोग पूर्वसूचना अहवाल',
    resultsSubtitle: 'निदान, हवामानाचा अंदाज, संभाव्य रोगाचा आलेख आणि कृती सल्ला.',
    backToDashboard: 'मुख्य पृष्ठावर परत जा',
    cropDiagnosis: 'पीक व फोटो निदान',
    candidateDetected: 'रोगाची संभाव्य लक्षणे आढळली',
    healthyStatus: 'पीक निरोगी दिसत आहे',
    inconclusiveStatus: 'फोटो अस्पष्ट किंवा अपुरा पुरावा',
    confidenceLabel: 'अंदाज विश्वासार्हता',
    imageEvidenceLabel: 'पानावर दिसलेली निरीक्षणे',
    uncertaintyNotesLabel: 'निदान स्पष्टीकरण व मर्यादा',
    weatherForecastTitle: 'पुढील सूक्ष्म-हवामान अंदाज',
    currentConditions: 'सध्याची शेतातील परिस्थिती',
    temperature: 'तापमान',
    humidity: 'हवेतील आर्द्रता',
    precipitation: 'पाऊस',
    weatherSource: 'हवामान माहिती स्रोत',
    riskTimelineTitle: '४८-तास रोगवाढीचा संभाव्य आलेख',
    riskTimelineSubtitle: 'बुरशी आणि जिवाणू वाढीसाठी हवामान अनुकूलतेचा वेळेनुसार अंदाज.',
    riskScoreLabel: 'धोका निर्देशांक (०-१००)',
    lowRisk: 'कमी धोका',
    moderateRisk: 'मध्यम धोका',
    highRisk: 'जास्त धोका',
    keyDriversLabel: 'धोका वाढवणारे हवामान घटक',
    interventionWindowLabel: 'पाहणी व उपाययोजनेची वेळ',
    advisoryTitle: 'शेतकऱ्यांसाठी कृती सल्ला',
    culturalPracticesTitle: 'तातडीने शेतात करावयाची कामे',
    chemicalWarningTitle: 'रासायनिक फवारणी सावधानता',
    recheckScheduleTitle: 'पुढील पाहणीची शिफारस वेळ',
    verifiedSourcesTitle: 'प्रमाणित कृषी मार्गदर्शक तत्त्वे',
    selectCropPlaceholder: 'पीक निवडा...',
    selectStagePlaceholder: 'वाढीची अवस्था निवडा...',
    validationImageRequired: 'कृपया पिकाचा फोटो अपलोड करा किंवा काढा.',
    validationCropRequired: 'कृपया पीक निवडा.',
    validationStageRequired: 'कृपया पिकाची वाढीची अवस्था निवडा.',
    validationCoordinatesRequired: 'कृपया योग्य स्थान (अक्षांश/रेखांश) प्रविष्ट करा.',
    retryAssessment: 'पुन्हा प्रयत्न करा',
    errorOccurred: 'तपासणी अयशस्वी झाली',
  },
  hi: {
    appName: 'एग्रीसेंट्री (AgriSentry)',
    appTagline: 'सूक्ष्म-जलवायु फसल रोग पूर्व चेतावनी प्रणाली',
    mockNotice: 'डेमो डेटा — वास्तविक खेत का पूर्वानुमान नहीं',
    liveMode: 'लाइव मोड',
    mockMode: 'डेमो / मॉक मोड',
    startAssessment: 'नई फसल जांच शुरू करें',
    recentAssessments: 'हालिया खेत जांच',
    noRecentAssessments: 'अभी तक कोई जांच दर्ज नहीं है।',
    howItWorksTitle: 'एग्रीसेंट्री फसलों की रक्षा कैसे करती है?',
    step1Title: '१. फसल की फोटो की जांच',
    step1Desc: 'शुरुआती लक्षणों की पहचान के लिए पत्ती की स्पष्ट फोटो अपलोड करें।',
    step2Title: '२. स्थानीय मौसम का पूर्वानुमान',
    step2Desc: 'आगामी तापमान और नमी के स्थानीय पूर्वानुमान को जोड़ता है।',
    step3Title: '३. रोग जोखिम का समय-आधारित आकलन',
    step3Desc: 'मौसम अनुसार रोग की संभावना बताकर गैर-जरूरी कीटनाशक छिड़काव रोकता है।',
    fieldAssessmentTitle: 'नई खेत फसल जांच',
    fieldAssessmentSubtitle: 'पत्ती की फोटो और खेत का स्थान दर्ज करके मौसम-आधारित रोग जोखिम रिपोर्ट पाएं।',
    cropTypeLabel: 'फसल का प्रकार',
    growthStageLabel: 'फसल की विकास अवस्था',
    uploadPhotoLabel: 'पत्ती / फसल की फोटो',
    uploadPhotoHelp: 'अच्छी रोशनी में पत्तियों के लक्षणों की पास से फोटो लें (अधिकतम 10 MB)।',
    dragOrClick: 'कैमरे से फोटो लें या गैलरी से चुनें',
    replacePhoto: 'फोटो बदलें',
    removePhoto: 'हटाएं',
    fieldLocationLabel: 'खेत का स्थान (अक्षांश / देशांतर)',
    useCurrentLocation: 'GPS स्थान का उपयोग करें',
    fetchingLocation: 'स्थान प्राप्त किया जा रहा है...',
    latitudeLabel: 'अक्षांश (Latitude)',
    longitudeLabel: 'देशांतर (Longitude)',
    observationsLabel: 'किसान के अवलोकन (वैकल्पिक)',
    observationsPlaceholder: 'पत्तियों पर धब्बे, पीलापन या हाल की बारिश के बारे में लिखें...',
    analyzeButton: 'फसल स्वास्थ्य का विश्लेषण करें',
    analyzingButton: 'फोटो और मौसम का विश्लेषण हो रहा है...',
    resultsTitle: 'फसल रोग चेतावनी रिपोर्ट',
    resultsSubtitle: 'निदान, स्थानीय मौसम, समय-आधारित जोखिम वक्र और व्यावहारिक सुझाव।',
    backToDashboard: 'डैशबोर्ड पर वापस जाएं',
    cropDiagnosis: 'फसल और छवि निदान',
    candidateDetected: 'संभावित रोग के लक्षण पाए गए',
    healthyStatus: 'फसल स्वस्थ प्रतीत होती है',
    inconclusiveStatus: 'अस्पष्ट या अपर्याप्त साक्ष्य',
    confidenceLabel: 'मॉडल विश्वसनीयता',
    imageEvidenceLabel: 'छवि में देखे गए लक्षण',
    uncertaintyNotesLabel: 'निदान संबंधी अनिश्चितता व नोट्स',
    weatherForecastTitle: 'आगामी सूक्ष्म-जलवायु मौसम पूर्वानुमान',
    currentConditions: 'खेत की वर्तमान स्थिति',
    temperature: 'तापमान',
    humidity: 'आर्द्रता (नमी)',
    precipitation: 'वर्षा',
    weatherSource: 'मौसम डेटा स्रोत',
    riskTimelineTitle: '४८-घंटे रोग जोखिम प्रगति टाइमलाइन',
    riskTimelineSubtitle: 'कवक एवं जीवाणु वृद्धि के लिए मौसम की अनुकूलता का समय-आधारित वक्र।',
    riskScoreLabel: 'जोखिम सूचकांक (०-१००)',
    lowRisk: 'कम जोखिम',
    moderateRisk: 'मध्यम जोखिम',
    highRisk: 'उच्च जोखिम',
    keyDriversLabel: 'जोखिम बढ़ाने वाले मौसम कारक',
    interventionWindowLabel: 'निगरानी / कार्रवाई का अनुशंसित समय',
    advisoryTitle: 'व्यावहारिक कृषि परामर्श',
    culturalPracticesTitle: 'खेत में तुरंत किए जाने वाले कार्य',
    chemicalWarningTitle: 'कीटनाशक व रसायन संबंधी चेतावनी',
    recheckScheduleTitle: 'अगले निरीक्षण का समय',
    verifiedSourcesTitle: 'प्रमाणित वैज्ञानिक दिशानिर्देश',
    selectCropPlaceholder: 'फसल चुनें...',
    selectStagePlaceholder: 'विकास अवस्था चुनें...',
    validationImageRequired: 'कृपया फसल की फोटो अपलोड करें या खींचें।',
    validationCropRequired: 'कृपया फसल का प्रकार चुनें।',
    validationStageRequired: 'कृपया फसल की विकास अवस्था चुनें।',
    validationCoordinatesRequired: 'कृपया वैध अक्षांश और देशांतर दर्ज करें।',
    retryAssessment: 'पुनः प्रयास करें',
    errorOccurred: 'जांच विफल रही',
  },
}
