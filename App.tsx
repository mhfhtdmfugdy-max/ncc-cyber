import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Header } from "./components/Header";
import { PermissionRequest } from "./components/PermissionRequest";
import { MainSections } from "./components/MainSections";
import { ReportForm } from "./components/ReportForm";
import { AIAssistant } from "./components/AIAssistant";
import { LinkChecker } from "./components/LinkChecker";
import { ContactSection } from "./components/ContactSection";
import { AdminDashboard } from "./components/AdminDashboard";

export default function App() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    // Show welcome notification for exactly 2 seconds
    if (showWelcome) {
      toast.success(
        language === 'ar' 
          ? "مرحباً بك في NCC - منصة الأمن السيبراني الوطني" 
          : "Welcome to NCC – National Cyber Security Platform", 
        {
          description: language === 'ar' 
            ? "منصتك الموثوقة للإبلاغ عن الأمن السيبراني والمساعدة" 
            : "Your trusted platform for cybersecurity reporting and assistance",
          duration: 2000,
        }
      );
      setTimeout(() => setShowWelcome(false), 2000);
    }
  }, [showWelcome, language]);

  const handlePermissionsGranted = () => {
    setPermissionsGranted(true);
    toast.success(language === 'ar' ? "تم منح الأذونات بنجاح" : "Permissions granted successfully");
  };

  const handleSectionClick = (section: string) => {
    setSelectedSection(section);
    setCurrentView("report");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedSection("");
  };

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
  };

  if (!permissionsGranted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <Header language={language} onLanguageChange={handleLanguageChange} />
        <PermissionRequest onPermissionsGranted={handlePermissionsGranted} language={language} />
        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <Header language={language} onLanguageChange={handleLanguageChange} />
      
      <main className="container mx-auto px-4 py-6">
        {currentView === "home" && (
          <MainSections 
            onSectionClick={handleSectionClick}
            onViewChange={setCurrentView}
            language={language}
          />
        )}
        
        {currentView === "report" && (
          <ReportForm 
            section={selectedSection}
            onBack={handleBackToHome}
            language={language}
          />
        )}
        
        {currentView === "ai-assistant" && (
          <AIAssistant onBack={handleBackToHome} language={language} />
        )}
        
        {currentView === "link-checker" && (
          <LinkChecker onBack={handleBackToHome} language={language} />
        )}
        
        {currentView === "contact" && (
          <ContactSection onBack={handleBackToHome} language={language} />
        )}
        
        {currentView === "admin" && (
          <AdminDashboard onBack={handleBackToHome} language={language} />
        )}
      </main>
      
      <Toaster position="top-center" />
    </div>
  );
}
