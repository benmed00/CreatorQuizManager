import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define direction type
type Direction = 'ltr' | 'rtl';

// Define language interface
interface Language {
  code: string;
  name: string;
  flag: string;
  dir: Direction;
}

// Supported languages
export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
];

// Define translations directly
const enTranslations = {
  "welcome": "Welcome",
  "description": "This app supports 5 languages",
  "current_time": "Current time: {{time}}",
  "language": "Language",
  "home": "Home",
  "dashboard": "Dashboard",
  "quizzes": "Quizzes",
  "create_quiz": "Create Quiz",
  "my_quizzes": "My Quizzes",
  "profile": "Profile",
  "logout": "Logout",
  "login": "Login",
  "register": "Register",
  "quiz_title": "Quiz Title",
  "quiz_description": "Quiz Description",
  "quiz_category": "Quiz Category",
  "quiz_difficulty": "Quiz Difficulty",
  "beginner": "Beginner",
  "intermediate": "Intermediate",
  "advanced": "Advanced",
  "expert": "Expert",
  "start_quiz": "Start Quiz",
  "next": "Next",
  "previous": "Previous",
  "submit": "Submit",
  "results": "Results",
  "score": "Score",
  "correct_answers": "Correct Answers",
  "incorrect_answers": "Incorrect Answers",
  "time_taken": "Time Taken",
  "share_results": "Share Results",
  "try_again": "Try Again",
  "question": "Question",
  "of": "of",
  "question_review": "Question Review",
  "your_answer": "Your answer",
  "correct_answer": "Correct answer",
  "error_loading_quiz": "Error loading quiz",
  "error_submitting_quiz": "Error submitting quiz",
  "error_creating_quiz": "Error creating quiz",
  "quiz_generation_success": "Quiz generated successfully",
  "quiz_generation_failure": "Failed to generate quiz",
  "retry": "Retry",
  "go_back": "Go Back"
};

const frTranslations = {
  "welcome": "Bienvenue",
  "description": "Cette application prend en charge 5 langues",
  "current_time": "Heure actuelle: {{time}}",
  "language": "Langue",
  "home": "Accueil",
  "dashboard": "Tableau de bord",
  "quizzes": "Quiz",
  "create_quiz": "Créer un Quiz",
  "my_quizzes": "Mes Quiz",
  "profile": "Profil",
  "logout": "Déconnexion",
  "login": "Connexion",
  "register": "S'inscrire",
  "quiz_title": "Titre du Quiz",
  "quiz_description": "Description du Quiz",
  "quiz_category": "Catégorie du Quiz",
  "quiz_difficulty": "Difficulté du Quiz",
  "beginner": "Débutant",
  "intermediate": "Intermédiaire",
  "advanced": "Avancé",
  "expert": "Expert",
  "start_quiz": "Commencer le Quiz",
  "next": "Suivant",
  "previous": "Précédent",
  "submit": "Soumettre",
  "results": "Résultats",
  "score": "Score",
  "correct_answers": "Réponses correctes",
  "incorrect_answers": "Réponses incorrectes",
  "time_taken": "Temps pris",
  "share_results": "Partager les résultats",
  "try_again": "Réessayer",
  "question": "Question",
  "of": "de",
  "question_review": "Révision des questions",
  "your_answer": "Votre réponse",
  "correct_answer": "Réponse correcte",
  "error_loading_quiz": "Erreur lors du chargement du quiz",
  "error_submitting_quiz": "Erreur lors de la soumission du quiz",
  "error_creating_quiz": "Erreur lors de la création du quiz",
  "quiz_generation_success": "Quiz généré avec succès",
  "quiz_generation_failure": "Échec de la génération du quiz",
  "retry": "Réessayer",
  "go_back": "Retour"
};

const esTranslations = {
  "welcome": "Bienvenido",
  "description": "Esta aplicación es compatible con 5 idiomas",
  "current_time": "Hora actual: {{time}}",
  "language": "Idioma",
  "home": "Inicio",
  "dashboard": "Panel",
  "quizzes": "Cuestionarios",
  "create_quiz": "Crear Cuestionario",
  "my_quizzes": "Mis Cuestionarios",
  "profile": "Perfil",
  "logout": "Cerrar sesión",
  "login": "Iniciar sesión",
  "register": "Registrarse",
  "quiz_title": "Título del Cuestionario",
  "quiz_description": "Descripción del Cuestionario",
  "quiz_category": "Categoría del Cuestionario",
  "quiz_difficulty": "Dificultad del Cuestionario",
  "beginner": "Principiante",
  "intermediate": "Intermedio",
  "advanced": "Avanzado",
  "expert": "Experto",
  "start_quiz": "Iniciar Cuestionario",
  "next": "Siguiente",
  "previous": "Anterior",
  "submit": "Enviar",
  "results": "Resultados",
  "score": "Puntuación",
  "correct_answers": "Respuestas correctas",
  "incorrect_answers": "Respuestas incorrectas",
  "time_taken": "Tiempo empleado",
  "share_results": "Compartir resultados",
  "try_again": "Intentar de nuevo",
  "question": "Pregunta",
  "of": "de",
  "question_review": "Revisión de preguntas",
  "your_answer": "Tu respuesta",
  "correct_answer": "Respuesta correcta",
  "error_loading_quiz": "Error al cargar el cuestionario",
  "error_submitting_quiz": "Error al enviar el cuestionario",
  "error_creating_quiz": "Error al crear el cuestionario",
  "quiz_generation_success": "Cuestionario generado con éxito",
  "quiz_generation_failure": "Error al generar el cuestionario",
  "retry": "Reintentar",
  "go_back": "Volver"
};

const zhTranslations = {
  "welcome": "欢迎",
  "description": "此应用程序支持5种语言",
  "current_time": "当前时间: {{time}}",
  "language": "语言",
  "home": "首页",
  "dashboard": "仪表板",
  "quizzes": "测验",
  "create_quiz": "创建测验",
  "my_quizzes": "我的测验",
  "profile": "个人资料",
  "logout": "登出",
  "login": "登录",
  "register": "注册",
  "quiz_title": "测验标题",
  "quiz_description": "测验描述",
  "quiz_category": "测验类别",
  "quiz_difficulty": "测验难度",
  "beginner": "初学者",
  "intermediate": "中级",
  "advanced": "高级",
  "expert": "专家",
  "start_quiz": "开始测验",
  "next": "下一个",
  "previous": "上一个",
  "submit": "提交",
  "results": "结果",
  "score": "得分",
  "correct_answers": "正确答案",
  "incorrect_answers": "错误答案",
  "time_taken": "花费时间",
  "share_results": "分享结果",
  "try_again": "再试一次",
  "question": "问题",
  "of": "的",
  "question_review": "问题回顾",
  "your_answer": "你的答案",
  "correct_answer": "正确答案",
  "error_loading_quiz": "加载测验时出错",
  "error_submitting_quiz": "提交测验时出错",
  "error_creating_quiz": "创建测验时出错",
  "quiz_generation_success": "测验生成成功",
  "quiz_generation_failure": "生成测验失败",
  "retry": "重试",
  "go_back": "返回"
};

const arTranslations = {
  "welcome": "مرحبًا",
  "description": "يدعم هذا التطبيق 5 لغات",
  "current_time": "الوقت الحالي: {{time}}",
  "language": "اللغة",
  "home": "الرئيسية",
  "dashboard": "لوحة التحكم",
  "quizzes": "الاختبارات",
  "create_quiz": "إنشاء اختبار",
  "my_quizzes": "اختباراتي",
  "profile": "الملف الشخصي",
  "logout": "تسجيل الخروج",
  "login": "تسجيل الدخول",
  "register": "التسجيل",
  "quiz_title": "عنوان الاختبار",
  "quiz_description": "وصف الاختبار",
  "quiz_category": "فئة الاختبار",
  "quiz_difficulty": "مستوى الصعوبة",
  "beginner": "مبتدئ",
  "intermediate": "متوسط",
  "advanced": "متقدم",
  "expert": "خبير",
  "start_quiz": "بدء الاختبار",
  "next": "التالي",
  "previous": "السابق",
  "submit": "إرسال",
  "results": "النتائج",
  "score": "النتيجة",
  "correct_answers": "الإجابات الصحيحة",
  "incorrect_answers": "الإجابات الخاطئة",
  "time_taken": "الوقت المستغرق",
  "share_results": "مشاركة النتائج",
  "try_again": "المحاولة مرة أخرى",
  "question": "سؤال",
  "of": "من",
  "question_review": "مراجعة الأسئلة",
  "your_answer": "إجابتك",
  "correct_answer": "الإجابة الصحيحة",
  "error_loading_quiz": "خطأ في تحميل الاختبار",
  "error_submitting_quiz": "خطأ في إرسال الاختبار",
  "error_creating_quiz": "خطأ في إنشاء الاختبار",
  "quiz_generation_success": "تم إنشاء الاختبار بنجاح",
  "quiz_generation_failure": "فشل في إنشاء الاختبار",
  "retry": "إعادة المحاولة",
  "go_back": "العودة"
};

const resources = {
  en: { common: enTranslations },
  fr: { common: frTranslations },
  es: { common: esTranslations },
  zh: { common: zhTranslations },
  ar: { common: arTranslations }
};

const DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
};

// Initialize i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize configuration
  .init({
    debug: import.meta.env.DEV, // Enable debug in development
    fallbackLng: 'en',
    supportedLngs: languages.map(lang => lang.code),
    defaultNS: 'common',
    ns: ['common'],
    resources,
    detection: DETECTION_OPTIONS,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    // Special handling for pluralization and formatting
    pluralSeparator: '_',
    contextSeparator: '_',
    react: {
      useSuspense: false, // Changed to false since translations are bundled
    },
  });

// Function to get language direction (RTL or LTR)
export const getLanguageDirection = (lang: string): Direction => {
  const language = languages.find(l => l.code === lang);
  return language?.dir || 'ltr';
};

// Helper function to change language
export const changeLanguage = (lang: string): Promise<any> => {
  return i18n.changeLanguage(lang);
};

// Helper to get current language
export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

export default i18n;