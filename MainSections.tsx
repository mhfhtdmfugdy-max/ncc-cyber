import { 
  Shield, 
  Heart, 
  Database, 
  AlertTriangle, 
  Bot, 
  Link, 
  Phone,
  Settings
} from "lucide-react";

interface MainSectionsProps {
  onSectionClick: (section: string) => void;
  onViewChange: (view: string) => void;
  language: 'ar' | 'en';
}

// Modern cybersecurity-themed icons using SVG
const CyberCrimeIcon = () => (
  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DomesticViolenceIcon = () => (
  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const DataBreachIcon = () => (
  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ToxicSubstancesIcon = () => (
  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const AIAssistantIcon = () => (
  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const LinkCheckerIcon = () => (
  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const ContactIcon = () => (
  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export function MainSections({ onSectionClick, onViewChange, language }: MainSectionsProps) {
  const reportingSections = [
    {
      id: "cyber-crimes",
      title: language === 'ar' ? "الجرائم السيبرانية" : "Cyber Crimes",
      description: language === 'ar' ? "الإبلاغ عن الاحتيال الإلكتروني والقرصنة وسرقة الهوية" : "Report online fraud, hacking, identity theft",
      icon: CyberCrimeIcon,
      color: "bg-gradient-to-r from-cyan-500 to-blue-600"
    },
    {
      id: "domestic-violence",
      title: language === 'ar' ? "العنف المنزلي" : "Domestic Violence",
      description: language === 'ar' ? "الإبلاغ عن العنف والإساءة المنزلية" : "Report domestic abuse and violence",
      icon: DomesticViolenceIcon,
      color: "bg-gradient-to-r from-cyan-500 to-blue-600"
    },
    {
      id: "data-breaches",
      title: language === 'ar' ? "انتهاك البيانات الشخصية" : "Personal Data Breaches",
      description: language === 'ar' ? "الإبلاغ عن الوصول غير المصرح به للبيانات الشخصية" : "Report unauthorized access to personal data",
      icon: DataBreachIcon,
      color: "bg-gradient-to-r from-cyan-500 to-blue-600"
    },
    {
      id: "toxic-substances",
      title: language === 'ar' ? "المواد السامة / المخدرات" : "Toxic Substances / Drugs",
      description: language === 'ar' ? "الإبلاغ عن الجرائم المتعلقة بالمخدرات والمواد السامة" : "Report drug-related crimes and toxic substances",
      icon: ToxicSubstancesIcon,
      color: "bg-gradient-to-r from-cyan-500 to-blue-600"
    }
  ];

  const additionalSections = [
    {
      id: "ai-assistant",
      title: language === 'ar' ? "مساعد الذكي الاصطناعي" : "AI Assistant Chatbot",
      description: language === 'ar' ? "احصل على نصائح وإرشادات الأمن السيبراني" : "Get cybersecurity advice and guidance",
      icon: AIAssistantIcon,
      color: "bg-gradient-to-r from-cyan-500 to-blue-600"
    },
    {
      id: "link-checker",
      title: language === 'ar' ? "فاحص الروابط المشبوهة" : "Suspicious Link Checker",
      description: language === 'ar' ? "تحقق من أمان الرابط قبل النقر عليه" : "Check if a link is safe to click",
      icon: LinkCheckerIcon,
      color: "bg-gradient-to-r from-cyan-500 to-blue-600"
    },
    {
      id: "contact",
      title: language === 'ar' ? "اتصل بالأمن السيبراني" : "Contact Cyber Security",
      description: language === 'ar' ? "جهات الاتصال الطارئة والدعم" : "Emergency contacts and support",
      icon: ContactIcon,
      color: "bg-gradient-to-r from-cyan-500 to-blue-600"
    }
  ];

  return (
    <div className={`space-y-8 px-4 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Admin Access Button */}
      <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
        <button
          onClick={() => onViewChange("admin")}
          className="flex items-center space-x-2 text-gray-500 hover:text-cyan-600 transition-colors p-3 touch-manipulation"
        >
          <Settings className="h-5 w-5" />
          <span className="text-base font-medium">{language === 'ar' ? 'المدير' : 'Admin'}</span>
        </button>
      </div>

      {/* Reporting Sections */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
          {language === 'ar' ? 'الإبلاغ عن مشاكل الأمان' : 'Report Security Issues'}
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {reportingSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 text-left border border-gray-100 hover:border-cyan-200 transform hover:-translate-y-1 touch-manipulation"
              >
                <div className={`flex items-start space-x-4 ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`${section.color} p-4 rounded-xl shadow-lg flex-shrink-0`}>
                    <IconComponent />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                      {section.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Services */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
          {language === 'ar' ? 'خدمات الأمان' : 'Security Services'}
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {additionalSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onViewChange(section.id)}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:border-cyan-200 transform hover:-translate-y-1 touch-manipulation"
              >
                <div className={`${section.color} p-4 rounded-xl mx-auto mb-4 w-fit shadow-lg`}>
                  <IconComponent />
                </div>
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                  {section.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
