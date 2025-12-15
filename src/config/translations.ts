export type Language = 'id' | 'en' | 'ar' | 'es' | 'de';

export interface Translations {
  // Navigation
  appName: string;
  systemOnline: string;
  systemOffline: string;
  scanNew: string;
  analysisComplete: string;

  // Main Landing
  tagline: string;
  mainTitle: string;
  mainSubtitle: string;
  description: string;
  selectPhoto: string;
  dropImageNow: string;
  dragAndDrop: string;

  // Features
  visualRecognition: string;
  searchGrounding: string;
  neuralTTS: string;

  // Processing States
  initializing: string;
  calibratingSensors: string;
  analyzingVisualData: string;
  identifyingPatterns: string;
  accessingArchives: string;
  crossReferencing: string;
  synthesizingAudio: string;
  generatingNarration: string;

  // Result View
  aiDetectedLandmark: string;
  audioGuide: string;
  sources: string;

  // Error
  systemError: string;
  tryAgain: string;

  // Drag and Drop
  dropImageHere: string;
  releaseToUpload: string;

  // Language Names
  languageName: string;
}

export const translations: Record<Language, Translations> = {
  id: {
    // Navigation
    appName: 'Landmark Lens',
    systemOnline: 'Sistem Online',
    systemOffline: 'Sistem Offline',
    scanNew: 'Pindai Baru',
    analysisComplete: 'ANALISIS SELESAI',

    // Main Landing
    tagline: 'Mesin Visi Gemini 2.5',
    mainTitle: 'Landmark',
    mainSubtitle: 'Lens',
    description: 'Unggah foto landmark. AI kami mengenali tempatnya, memverifikasi faktanya, dan mengubah sejarah menjadi cerita waktu-nyata yang dibuat khusus untuk Anda.',
    selectPhoto: 'Pilih Foto',
    dropImageNow: 'Lepas Gambar Sekarang',
    dragAndDrop: 'atau Seret dan lepas gambar Anda di sini',

    // Features
    visualRecognition: 'Pengenalan Visual',
    searchGrounding: 'Pencarian Berbasis',
    neuralTTS: 'TTS Neural',

    // Processing States
    initializing: 'Menginisialisasi...',
    calibratingSensors: 'Mengkalibrasi sensor...',
    analyzingVisualData: 'Menganalisis Data Visual',
    identifyingPatterns: 'Mengidentifikasi pola struktural...',
    accessingArchives: 'Mengakses Arsip Global',
    crossReferencing: 'Mereferensi silang catatan historis...',
    synthesizingAudio: 'Mensintesis Panduan Audio',
    generatingNarration: 'Menghasilkan narasi suara neural...',

    // Result View
    aiDetectedLandmark: 'Landmark Terdeteksi AI',
    audioGuide: 'Panduan Audio',
    sources: 'Sumber',

    // Error
    systemError: 'Kesalahan Sistem',
    tryAgain: 'Coba Lagi',

    // Drag and Drop
    dropImageHere: 'Lepas Gambar Di Sini',
    releaseToUpload: 'Lepaskan untuk mengunggah foto landmark Anda',

    // Language Names
    languageName: 'Bahasa Indonesia',
  },
  en: {
    // Navigation
    appName: 'Landmark Lens',
    systemOnline: 'System Online',
    systemOffline: 'System Offline',
    scanNew: 'Scan New',
    analysisComplete: 'ANALYSIS COMPLETE',

    // Main Landing
    tagline: 'Gemini 2.5 Vision Engine',
    mainTitle: 'Landmark',
    mainSubtitle: 'Lens',
    description: 'Upload a landmark photo. Our AI pinpoints the place, verifies the facts, and turns the history into a real-time story made just for you.',
    selectPhoto: 'Select Photo',
    dropImageNow: 'Drop Image Now',
    dragAndDrop: 'or Drag and drop your image here',

    // Features
    visualRecognition: 'Visual Recognition',
    searchGrounding: 'Search Grounding',
    neuralTTS: 'Neural TTS',

    // Processing States
    initializing: 'Initializing...',
    calibratingSensors: 'Calibrating sensors...',
    analyzingVisualData: 'Analyzing Visual Data',
    identifyingPatterns: 'Identifying structural patterns...',
    accessingArchives: 'Accessing Global Archives',
    crossReferencing: 'Cross-referencing historical records...',
    synthesizingAudio: 'Synthesizing Audio Guide',
    generatingNarration: 'Generating neural voice narration...',

    // Result View
    aiDetectedLandmark: 'AI Detected Landmark',
    audioGuide: 'Audio Guide',
    sources: 'Sources',

    // Error
    systemError: 'System Error',
    tryAgain: 'Try Again',

    // Drag and Drop
    dropImageHere: 'Drop Image Here',
    releaseToUpload: 'Release to upload your landmark photo',

    // Language Names
    languageName: 'English',
  },
  ar: {
    // Navigation
    appName: 'Landmark Lens',
    systemOnline: 'النظام متصل',
    systemOffline: 'النظام غير متصل',
    scanNew: 'مسح جديد',
    analysisComplete: 'اكتمل التحليل',

    // Main Landing
    tagline: 'محرك الرؤية جيميني 2.5',
    mainTitle: 'Landmark',
    mainSubtitle: 'Lens',
    description: 'قم بتحميل صورة معلم. يحدد الذكاء الاصطناعي لدينا المكان، ويتحقق من الحقائق، ويحول التاريخ إلى قصة في الوقت الفعلي مصنوعة خصيصًا لك.',
    selectPhoto: 'اختر صورة',
    dropImageNow: 'أسقط الصورة الآن',
    dragAndDrop: 'أو اسحب وأفلت صورتك هنا',

    // Features
    visualRecognition: 'التعرف البصري',
    searchGrounding: 'البحث الأساسي',
    neuralTTS: 'TTS العصبي',

    // Processing States
    initializing: 'جاري التهيئة...',
    calibratingSensors: 'معايرة أجهزة الاستشعار...',
    analyzingVisualData: 'تحليل البيانات المرئية',
    identifyingPatterns: 'تحديد الأنماط الهيكلية...',
    accessingArchives: 'الوصول إلى الأرشيفات العالمية',
    crossReferencing: 'الرجوع المتبادل للسجلات التاريخية...',
    synthesizingAudio: 'تركيب الدليل الصوتي',
    generatingNarration: 'توليد السرد الصوتي العصبي...',

    // Result View
    aiDetectedLandmark: 'معلم تم اكتشافه بواسطة الذكاء الاصطناعي',
    audioGuide: 'دليل صوتي',
    sources: 'المصادر',

    // Error
    systemError: 'خطأ في النظام',
    tryAgain: 'حاول مرة أخرى',

    // Drag and Drop
    dropImageHere: 'أسقط الصورة هنا',
    releaseToUpload: 'حرر لتحميل صورة المعلم الخاص بك',

    // Language Names
    languageName: 'العربية',
  },
  es: {
    // Navigation
    appName: 'Landmark Lens',
    systemOnline: 'Sistema en Línea',
    systemOffline: 'Sistema Fuera de Línea',
    scanNew: 'Escanear Nuevo',
    analysisComplete: 'ANÁLISIS COMPLETO',

    // Main Landing
    tagline: 'Motor de Visión Gemini 2.5',
    mainTitle: 'Landmark',
    mainSubtitle: 'Lens',
    description: 'Sube una foto de un monumento. Nuestra IA identifica el lugar, verifica los hechos y convierte la historia en una narrativa en tiempo real hecha solo para ti.',
    selectPhoto: 'Seleccionar Foto',
    dropImageNow: 'Suelta la Imagen Ahora',
    dragAndDrop: 'o Arrastra y suelta tu imagen aquí',

    // Features
    visualRecognition: 'Reconocimiento Visual',
    searchGrounding: 'Búsqueda Fundamentada',
    neuralTTS: 'TTS Neural',

    // Processing States
    initializing: 'Inicializando...',
    calibratingSensors: 'Calibrando sensores...',
    analyzingVisualData: 'Analizando Datos Visuales',
    identifyingPatterns: 'Identificando patrones estructurales...',
    accessingArchives: 'Accediendo a Archivos Globales',
    crossReferencing: 'Cruzando referencias de registros históricos...',
    synthesizingAudio: 'Sintetizando Guía de Audio',
    generatingNarration: 'Generando narración de voz neural...',

    // Result View
    aiDetectedLandmark: 'Monumento Detectado por IA',
    audioGuide: 'Guía de Audio',
    sources: 'Fuentes',

    // Error
    systemError: 'Error del Sistema',
    tryAgain: 'Intentar de Nuevo',

    // Drag and Drop
    dropImageHere: 'Suelta la Imagen Aquí',
    releaseToUpload: 'Suelta para cargar tu foto del monumento',

    // Language Names
    languageName: 'Español',
  },
  de: {
    // Navigation
    appName: 'Landmark Lens',
    systemOnline: 'System Online',
    systemOffline: 'System Offline',
    scanNew: 'Neu Scannen',
    analysisComplete: 'ANALYSE ABGESCHLOSSEN',

    // Main Landing
    tagline: 'Gemini 2.5 Vision Engine',
    mainTitle: 'Landmark',
    mainSubtitle: 'Lens',
    description: 'Lade ein Wahrzeichen-Foto hoch. Unsere KI lokalisiert den Ort, überprüft die Fakten und verwandelt die Geschichte in eine Echtzeit-Erzählung, die nur für dich gemacht wurde.',
    selectPhoto: 'Foto Auswählen',
    dropImageNow: 'Bild Jetzt Ablegen',
    dragAndDrop: 'oder Ziehe dein Bild hierher',

    // Features
    visualRecognition: 'Visuelle Erkennung',
    searchGrounding: 'Suchfundierung',
    neuralTTS: 'Neurales TTS',

    // Processing States
    initializing: 'Initialisierung...',
    calibratingSensors: 'Sensoren kalibrieren...',
    analyzingVisualData: 'Visuelle Daten Analysieren',
    identifyingPatterns: 'Strukturelle Muster identifizieren...',
    accessingArchives: 'Zugriff auf Globale Archive',
    crossReferencing: 'Querverweise historischer Aufzeichnungen...',
    synthesizingAudio: 'Audio-Guide Synthetisieren',
    generatingNarration: 'Neurale Spracherzählung generieren...',

    // Result View
    aiDetectedLandmark: 'KI-Erkanntes Wahrzeichen',
    audioGuide: 'Audio-Guide',
    sources: 'Quellen',

    // Error
    systemError: 'Systemfehler',
    tryAgain: 'Erneut Versuchen',

    // Drag and Drop
    dropImageHere: 'Bild Hier Ablegen',
    releaseToUpload: 'Loslassen, um dein Wahrzeichen-Foto hochzuladen',

    // Language Names
    languageName: 'Deutsch',
  },
};

export const languageOptions: { code: Language; name: string; flag: string }[] = [
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];
