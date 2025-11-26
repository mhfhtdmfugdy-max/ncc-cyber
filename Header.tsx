import { Shield, Globe } from "lucide-react";

interface HeaderProps {
  language: 'ar' | 'en';
  onLanguageChange: (lang: 'ar' | 'en') => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-cyan-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-900 tracking-wide">
              NCC
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 sm:p-3 rounded-lg">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center">
                {language === 'ar' ? 'الأمن السيبراني الوطني' : 'National Cyber Security'}
              </h1>
            </div>
          </div>
          
          <button
            onClick={() => onLanguageChange(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-md touch-manipulation"
          >
            <Globe className="h-5 w-5" />
            <span className="font-medium text-base">
              {language === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
