import { ArrowLeft, Phone, MessageCircle, Instagram, Music } from "lucide-react";

interface ContactSectionProps {
  onBack: () => void;
  language: 'ar' | 'en';
}

export function ContactSection({ onBack, language }: ContactSectionProps) {
  const contacts = [
    {
      type: language === 'ar' ? "طوارئ" : "Emergency",
      value: "911",
      description: language === 'ar' ? "للمساعدة الطارئة الفورية" : "For immediate emergency assistance",
      icon: Phone,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      action: () => window.open("tel:911")
    },
    {
      type: "WhatsApp",
      value: "+49 176 21977373",
      description: language === 'ar' ? "دعم المراسلة المباشرة" : "Direct messaging support",
      icon: MessageCircle,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      action: () => window.open("https://wa.me/4917621977373")
    },
    {
      type: "Instagram",
      value: "@dzir24",
      description: language === 'ar' ? "تابع للحصول على التحديثات والنصائح" : "Follow for updates and tips",
      icon: Instagram,
      color: "bg-gradient-to-r from-pink-500 to-pink-600",
      action: () => window.open("https://www.instagram.com/dzir24")
    },
    {
      type: "TikTok",
      value: "@17dzir",
      description: language === 'ar' ? "محتوى تعليمي حول الأمن السيبراني" : "Educational cybersecurity content",
      icon: Music,
      color: "bg-gradient-to-r from-gray-800 to-black",
      action: () => window.open("https://www.tiktok.com/@17dzir")
    }
  ];

  return (
    <div className={`max-w-2xl mx-auto px-4 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-3 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {language === 'ar' ? 'اتصل بالأمن السيبراني' : 'Contact Cyber Security'}
          </h1>
        </div>
        
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <p className="text-cyan-800 text-sm leading-relaxed">
            {language === 'ar'
              ? 'تحتاج مساعدة فورية أو تريد البقاء على اتصال؟ استخدم أي من طرق الاتصال أدناه. للطوارئ، اتصل دائماً بـ 911 أولاً.'
              : 'Need immediate help or want to stay connected? Use any of the contact methods below. For emergencies, always call 911 first.'
            }
          </p>
        </div>
        
        <div className="space-y-4">
          {contacts.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <button
                key={index}
                onClick={contact.action}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300 text-left transform hover:-translate-y-1 touch-manipulation"
              >
                <div className={`flex items-center space-x-4 ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`${contact.color} p-4 rounded-xl shadow-lg flex-shrink-0`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-800 text-base">{contact.type}</h3>
                      <span className="text-cyan-600 font-medium text-base">{contact.value}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{contact.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-base">
            {language === 'ar' ? 'ساعات العمل' : 'Office Hours'}
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>{language === 'ar' ? 'الاثنين - الجمعة: 8:00 ص - 6:00 م' : 'Monday - Friday: 8:00 AM - 6:00 PM'}</p>
            <p>{language === 'ar' ? 'السبت: 9:00 ص - 4:00 م' : 'Saturday: 9:00 AM - 4:00 PM'}</p>
            <p>{language === 'ar' ? 'الأحد: جهات الاتصال الطارئة فقط' : 'Sunday: Emergency contacts only'}</p>
            <p className="mt-3 font-medium text-base">
              {language === 'ar' ? 'خط الطوارئ (911) متاح 24/7' : 'Emergency line (911) available 24/7'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
