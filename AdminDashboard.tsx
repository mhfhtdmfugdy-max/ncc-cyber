import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, MapPin, Calendar, User, FileText, Users, ClipboardList } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AdminDashboardProps {
  onBack: () => void;
  language: 'ar' | 'en';
}

export function AdminDashboard({ onBack, language }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<'reports' | 'visitors'>('reports');
  
  const reports = useQuery(api.reports.getAllReports);
  const visitors = useQuery(api.visitors.getAllVisitors);
  const deleteReport = useMutation(api.reports.deleteReport);
  const deleteVisitor = useMutation(api.visitors.deleteVisitor);
  const clearAllReports = useMutation(api.reports.clearAllReports);
  const clearAllVisitors = useMutation(api.visitors.clearAllVisitors);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "SO20") {
      setIsAuthenticated(true);
      toast.success(language === 'ar' ? "تم منح الوصول للمدير" : "Admin access granted");
    } else {
      toast.error(language === 'ar' ? "كلمة مرور خاطئة" : "Invalid password");
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (confirm(language === 'ar' ? "هل أنت متأكد من حذف هذا التقرير؟" : "Are you sure you want to delete this report?")) {
      try {
        await deleteReport({ reportId: reportId as any });
        toast.success(language === 'ar' ? "تم حذف التقرير بنجاح" : "Report deleted successfully");
      } catch (error) {
        toast.error(language === 'ar' ? "فشل في حذف التقرير" : "Failed to delete report");
      }
    }
  };

  const handleDeleteVisitor = async (visitorId: string) => {
    if (confirm(language === 'ar' ? "هل أنت متأكد من حذف بيانات هذا الزائر؟" : "Are you sure you want to delete this visitor data?")) {
      try {
        await deleteVisitor({ visitorId: visitorId as any });
        toast.success(language === 'ar' ? "تم حذف بيانات الزائر بنجاح" : "Visitor data deleted successfully");
      } catch (error) {
        toast.error(language === 'ar' ? "فشل في حذف بيانات الزائر" : "Failed to delete visitor data");
      }
    }
  };

  const handleClearAll = async () => {
    const confirmText = activeTab === 'reports' 
      ? (language === 'ar' ? "هل أنت متأكد من حذف جميع التقارير؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to delete ALL reports? This action cannot be undone.")
      : (language === 'ar' ? "هل أنت متأكد من حذف جميع بيانات الزوار؟ لا يمكن التراجع عن هذا الإجراء." : "Are you sure you want to delete ALL visitor data? This action cannot be undone.");
    
    if (confirm(confirmText)) {
      try {
        if (activeTab === 'reports') {
          await clearAllReports();
          toast.success(language === 'ar' ? "تم مسح جميع التقارير بنجاح" : "All reports cleared successfully");
        } else {
          await clearAllVisitors();
          toast.success(language === 'ar' ? "تم مسح جميع بيانات الزوار بنجاح" : "All visitor data cleared successfully");
        }
      } catch (error) {
        toast.error(language === 'ar' ? "فشل في المسح" : "Failed to clear data");
      }
    }
  };

  const getSectionTitle = (section: string) => {
    if (language === 'ar') {
      const titles = {
        "cyber-crimes": "الجرائم السيبرانية",
        "domestic-violence": "العنف المنزلي",
        "data-breaches": "انتهاك البيانات الشخصية",
        "toxic-substances": "المواد السامة / المخدرات"
      };
      return titles[section as keyof typeof titles] || section;
    } else {
      const titles = {
        "cyber-crimes": "Cyber Crimes",
        "domestic-violence": "Domestic Violence",
        "data-breaches": "Personal Data Breaches",
        "toxic-substances": "Toxic Substances / Drugs"
      };
      return titles[section as keyof typeof titles] || section;
    }
  };

  const getGenderText = (gender: string) => {
    if (language === 'ar') {
      return gender === 'male' ? 'ذكر' : 'أنثى';
    } else {
      return gender === 'male' ? 'Male' : 'Female';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`max-w-md mx-auto px-4 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-3 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {language === 'ar' ? 'وصول المدير' : 'Admin Access'}
            </h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'كلمة مرور المدير' : 'Admin Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent touch-manipulation"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-base hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 touch-manipulation"
            >
              {language === 'ar' ? 'الوصول إلى لوحة التحكم' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto px-4 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-3 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {language === 'ar' ? 'لوحة تحكم المدير' : 'Admin Dashboard'}
            </h1>
          </div>
          
          <button
            onClick={handleClearAll}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2 text-base font-medium touch-manipulation"
          >
            <Trash2 className="h-5 w-5" />
            <span>{language === 'ar' ? 'مسح الكل' : 'Clear All'}</span>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 text-base font-medium touch-manipulation ${
              activeTab === 'reports'
                ? 'bg-white text-cyan-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ClipboardList className="h-5 w-5" />
            <span>{language === 'ar' ? 'التقارير' : 'Reports'}</span>
            <span className="bg-cyan-100 text-cyan-800 text-sm px-2 py-1 rounded-full">
              {reports?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('visitors')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 text-base font-medium touch-manipulation ${
              activeTab === 'visitors'
                ? 'bg-white text-cyan-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>{language === 'ar' ? 'الزوار' : 'Visitors'}</span>
            <span className="bg-cyan-100 text-cyan-800 text-sm px-2 py-1 rounded-full">
              {visitors?.length || 0}
            </span>
          </button>
        </div>

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {reports?.map((report) => (
              <div key={report._id} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Report Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {getSectionTitle(report.section)}
                      </h3>
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        className="text-red-600 hover:text-red-800 p-2 touch-manipulation"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span><strong>{language === 'ar' ? 'الاسم:' : 'Name:'}</strong> {report.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span><strong>{language === 'ar' ? 'الموقع:' : 'Location:'}</strong> {report.governorate}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <strong>{language === 'ar' ? 'العمر:' : 'Age:'}</strong> {report.age}
                        </div>
                        <div>
                          <strong>{language === 'ar' ? 'الجنس:' : 'Gender:'}</strong> {getGenderText(report.gender)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span><strong>{language === 'ar' ? 'تاريخ التقديم:' : 'Submitted:'}</strong> {new Date(report.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {report.socialMedia && (
                      <div>
                        <strong>{language === 'ar' ? 'وسائل التواصل الاجتماعي:' : 'Social Media:'}</strong> {report.socialMedia}
                      </div>
                    )}
                    
                    <div>
                      <strong>{language === 'ar' ? 'تفاصيل التقرير:' : 'Report Details:'}</strong>
                      <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded text-sm leading-relaxed">
                        {report.reportDetails}
                      </p>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <strong>{language === 'ar' ? 'إحداثيات GPS:' : 'GPS Coordinates:'}</strong> {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                      <button
                        onClick={() => window.open(`https://www.google.com/maps?q=${report.latitude},${report.longitude}`, '_blank')}
                        className="ml-2 text-cyan-600 hover:underline touch-manipulation"
                      >
                        {language === 'ar' ? 'عرض على الخريطة' : 'View on Map'}
                      </button>
                    </div>
                    
                    {report.attachmentUrl && (
                      <div>
                        <strong>{language === 'ar' ? 'المرفق:' : 'Attachment:'}</strong>
                        <button
                          onClick={() => report.attachmentUrl && window.open(report.attachmentUrl, '_blank')}
                          className="ml-2 text-cyan-600 hover:underline flex items-center space-x-1 touch-manipulation"
                        >
                          <FileText className="h-4 w-4" />
                          <span>{language === 'ar' ? 'عرض المرفق' : 'View Attachment'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Selfie Photo */}
                  <div>
                    <strong className="block mb-2">{language === 'ar' ? 'صورة الهوية:' : 'Identity Photo:'}</strong>
                    {report.selfieUrl ? (
                      <img
                        src={report.selfieUrl}
                        alt="User selfie"
                        className="w-full max-w-xs rounded-lg border border-gray-300"
                      />
                    ) : (
                      <div className="w-full max-w-xs h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">{language === 'ar' ? 'الصورة غير متوفرة' : 'Photo not available'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {reports?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {language === 'ar' ? 'لم يتم تقديم أي تقارير بعد' : 'No reports submitted yet'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Visitors Tab */}
        {activeTab === 'visitors' && (
          <div className="space-y-6">
            {visitors?.map((visitor) => (
              <div key={visitor._id} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Visitor Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {language === 'ar' ? 'زائر' : 'Visitor'} #{visitor._id.slice(-6)}
                      </h3>
                      <button
                        onClick={() => handleDeleteVisitor(visitor._id)}
                        className="text-red-600 hover:text-red-800 p-2 touch-manipulation"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm"><strong>{language === 'ar' ? 'وقت الزيارة:' : 'Visit Time:'}</strong> {new Date(visitor.timestamp).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm"><strong>{language === 'ar' ? 'الموقع:' : 'Location:'}</strong></span>
                        <button
                          onClick={() => window.open(`https://www.google.com/maps?q=${visitor.latitude},${visitor.longitude}`, '_blank')}
                          className="text-cyan-600 hover:text-cyan-800 underline text-sm touch-manipulation"
                        >
                          {visitor.latitude.toFixed(6)}, {visitor.longitude.toFixed(6)}
                        </button>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          onClick={() => window.open(`https://www.google.com/maps?q=${visitor.latitude},${visitor.longitude}`, '_blank')}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 text-base font-medium touch-manipulation"
                        >
                          <MapPin className="h-5 w-5" />
                          <span>{language === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Visitor Photo */}
                  <div>
                    <strong className="block mb-2">{language === 'ar' ? 'صورة الزائر:' : 'Visitor Photo:'}</strong>
                    {visitor.photoUrl ? (
                      <img
                        src={visitor.photoUrl}
                        alt="Visitor photo"
                        className="w-full max-w-xs rounded-lg border border-gray-300"
                      />
                    ) : (
                      <div className="w-full max-w-xs h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">{language === 'ar' ? 'الصورة غير متوفرة' : 'Photo not available'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {visitors?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {language === 'ar' ? 'لا توجد بيانات زوار بعد' : 'No visitor data yet'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
