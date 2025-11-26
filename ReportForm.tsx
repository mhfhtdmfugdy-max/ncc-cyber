import { useState, useRef } from "react";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ReportFormProps {
  section: string;
  onBack: () => void;
  language: 'ar' | 'en';
}

const getSectionInfo = (section: string, language: 'ar' | 'en') => {
  const sectionInfo = {
    "cyber-crimes": {
      title: language === 'ar' ? "تقرير الجرائم السيبرانية" : "Cyber Crimes Report",
      awareness: language === 'ar' 
        ? "الجرائم السيبرانية هي جرائم خطيرة يمكن أن تسبب أضراراً مالية وعاطفية كبيرة. تقريرك يساعد في حماية الآخرين من هجمات مماثلة. سيتم التعامل مع جميع المعلومات بسرية من قبل متخصصي الأمن السيبراني."
        : "Cyber crimes are serious offenses that can cause significant financial and emotional damage. Your report helps protect others from similar attacks. All information will be handled confidentially by cybersecurity professionals."
    },
    "domestic-violence": {
      title: language === 'ar' ? "تقرير العنف المنزلي" : "Domestic Violence Report",
      awareness: language === 'ar'
        ? "العنف المنزلي غير مقبول أبداً والمساعدة متوفرة. سلامتك هي أولويتنا. سيتم التعامل مع هذا التقرير بأقصى درجات العناية والسرية من قبل متخصصين مدربين يمكنهم تقديم الدعم المناسب."
        : "Domestic violence is never acceptable and help is available. Your safety is our priority. This report will be handled with utmost care and confidentiality by trained professionals who can provide appropriate support."
    },
    "data-breaches": {
      title: language === 'ar' ? "تقرير انتهاك البيانات الشخصية" : "Personal Data Breach Report",
      awareness: language === 'ar'
        ? "انتهاكات البيانات الشخصية يمكن أن تؤدي إلى سرقة الهوية وانتهاك الخصوصية. الإبلاغ عن هذه الحوادث يساعد في منع المزيد من الوصول غير المصرح به ويحمي هويتك الرقمية. نحن نأخذ حماية البيانات على محمل الجد."
        : "Personal data breaches can lead to identity theft and privacy violations. Reporting these incidents helps prevent further unauthorized access and protects your digital identity. We take data protection seriously."
    },
    "toxic-substances": {
      title: language === 'ar' ? "تقرير المواد السامة / المخدرات" : "Toxic Substances / Drugs Report",
      awareness: language === 'ar'
        ? "الإبلاغ عن الأنشطة المتعلقة بالمخدرات والمواد السامة يساعد في حماية المجتمعات والصحة العامة. معلوماتك تساعد إنفاذ القانون في معالجة هذه المخاوف الخطيرة للسلامة العامة."
        : "Reporting drug-related activities and toxic substances helps protect communities and public health. Your information assists law enforcement in addressing these serious public safety concerns."
    }
  };
  
  return sectionInfo[section as keyof typeof sectionInfo];
};

export function ReportForm({ section, onBack, language }: ReportFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    governorate: "",
    age: "",
    gender: "",
    socialMedia: "",
    reportDetails: ""
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const submitReport = useMutation(api.reports.submitReport);
  const generateUploadUrl = useMutation(api.reports.generateUploadUrl);

  const info = getSectionInfo(section, language);

  const capturePhoto = async (): Promise<string> => {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: "user" } 
    });
    
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      
      // Wait a moment for the camera to adjust
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      context.drawImage(videoRef.current, 0, 0);
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop());
      
      return canvas.toDataURL('image/jpeg', 0.8);
    }
    
    throw new Error("Failed to capture photo");
  };

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        reject,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const uploadFile = async (file: Blob): Promise<string> => {
    const uploadUrl = await generateUploadUrl();
    
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    
    if (!response.ok) {
      throw new Error("Upload failed");
    }
    
    const { storageId } = await response.json();
    return storageId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.governorate || 
        !formData.age || !formData.gender || !formData.reportDetails) {
      toast.error(language === 'ar' ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Capture selfie
      const photoDataUrl = await capturePhoto();
      const photoBlob = await fetch(photoDataUrl).then(r => r.blob());
      const selfieId = await uploadFile(photoBlob);
      
      // Get location
      const location = await getCurrentLocation();
      
      // Upload attachment if provided
      let attachmentId;
      if (attachment) {
        attachmentId = await uploadFile(attachment);
      }
      
      // Submit report
      await submitReport({
        fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        governorate: formData.governorate,
        age: parseInt(formData.age),
        gender: formData.gender,
        socialMedia: formData.socialMedia,
        section,
        reportDetails: formData.reportDetails,
        attachmentId: attachmentId as any,
        selfieId: selfieId as any,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      toast.success(language === 'ar' ? "تم تقديم التقرير بنجاح" : "Report submitted successfully");
      onBack();
      
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(language === 'ar' ? "فشل في تقديم التقرير. يرجى المحاولة مرة أخرى." : "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto px-4 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-3 p-3 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{info.title}</h1>
        </div>
        
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <p className="text-cyan-800 text-sm leading-relaxed">
            {info.awareness}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم الأول *' : 'First Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent touch-manipulation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم الأوسط' : 'Middle Name'}
              </label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent touch-manipulation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'اسم العائلة *' : 'Last Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent touch-manipulation"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'المحافظة / المدينة *' : 'Governorate / City *'}
              </label>
              <input
                type="text"
                required
                value={formData.governorate}
                onChange={(e) => setFormData({...formData, governorate: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent touch-manipulation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'العمر *' : 'Age *'}
              </label>
              <input
                type="number"
                required
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent touch-manipulation"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {language === 'ar' ? 'الجنس *' : 'Gender *'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors touch-manipulation">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="mr-3 h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                  required
                />
                <span className="text-base font-medium text-gray-700">
                  {language === 'ar' ? 'ذكر' : 'Male'}
                </span>
              </label>
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors touch-manipulation">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="mr-3 h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                  required
                />
                <span className="text-base font-medium text-gray-700">
                  {language === 'ar' ? 'أنثى' : 'Female'}
                </span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'وسائل التواصل الاجتماعي (واتساب، إنستغرام، إلخ)' : 'Social Media (WhatsApp, Instagram, etc.)'}
            </label>
            <input
              type="text"
              placeholder={language === 'ar' ? "مثال: واتساب: +1234567890، إنستغرام: @username" : "e.g., WhatsApp: +1234567890, Instagram: @username"}
              value={formData.socialMedia}
              onChange={(e) => setFormData({...formData, socialMedia: e.target.value})}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent touch-manipulation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'تفاصيل التقرير *' : 'Report Details *'}
            </label>
            <textarea
              required
              rows={6}
              placeholder={language === 'ar' ? "يرجى تقديم معلومات مفصلة حول الحادثة..." : "Please provide detailed information about the incident..."}
              value={formData.reportDetails}
              onChange={(e) => setFormData({...formData, reportDetails: e.target.value})}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent touch-manipulation resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'رفع صورة/ملف (اختياري)' : 'Upload Image/File (Optional)'}
            </label>
            <div className="flex flex-col space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center space-x-2 px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
              >
                <Upload className="h-5 w-5" />
                <span className="text-base font-medium">{language === 'ar' ? 'اختر ملف' : 'Choose File'}</span>
              </button>
              {attachment && (
                <span className="text-sm text-gray-600 px-2">{attachment.name}</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-base hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 touch-manipulation"
          >
            {isSubmitting ? (
              <>
                <Camera className="h-5 w-5 animate-pulse" />
                <span>{language === 'ar' ? 'جاري تقديم التقرير...' : 'Submitting Report...'}</span>
              </>
            ) : (
              <span>{language === 'ar' ? 'تقديم التقرير' : 'Submit Report'}</span>
            )}
          </button>
        </form>
      </div>
      
      {/* Hidden video and canvas for photo capture */}
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
