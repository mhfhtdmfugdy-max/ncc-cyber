import { useState } from "react";
import { Camera, MapPin, Shield } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface PermissionRequestProps {
  onPermissionsGranted: () => void;
  language: 'ar' | 'en';
}

export function PermissionRequest({ onPermissionsGranted, language }: PermissionRequestProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  
  const recordVisitor = useMutation(api.visitors.recordVisitor);
  const generateUploadUrl = useMutation(api.reports.generateUploadUrl);

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

  const capturePhoto = async (): Promise<string> => {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: "user" } 
    });
    
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    video.srcObject = stream;
    await video.play();
    
    // Wait a moment for the camera to adjust
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    // Stop the stream
    stream.getTracks().forEach(track => track.stop());
    
    return canvas.toDataURL('image/jpeg', 0.8);
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

  const requestPermissions = async () => {
    setIsRequesting(true);
    
    try {
      // Capture visitor photo
      const photoDataUrl = await capturePhoto();
      const photoBlob = await fetch(photoDataUrl).then(r => r.blob());
      const photoId = await uploadFile(photoBlob);
      
      // Get location
      const location = await getCurrentLocation();
      
      // Record visitor
      await recordVisitor({
        photoId: photoId as any,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      toast.success(language === 'ar' ? "تم منح جميع الأذونات بنجاح" : "All permissions granted successfully");
      onPermissionsGranted();
      
    } catch (error) {
      console.error("Permission error:", error);
      toast.error(language === 'ar' ? "يرجى منح أذونات الكاميرا والموقع للمتابعة" : "Please grant camera and location permissions to continue");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-xl mx-auto mb-4 w-fit">
            <Shield className="h-20 w-20 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            {language === 'ar' ? 'التحقق الأمني' : 'Security Verification'}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            {language === 'ar' 
              ? 'للتحقق من هويتك وتقديم المساعدة القائمة على الموقع، نحتاج إذنك للوصول إلى الكاميرا والموقع.'
              : 'To verify your identity and provide location-based assistance, we need your permission to access your camera and location.'
            }
          </p>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-4 p-4 bg-cyan-50 rounded-lg">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-lg flex-shrink-0">
              <Camera className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-base">
                {language === 'ar' ? 'الوصول إلى الكاميرا' : 'Camera Access'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'للتحقق من الهوية' : 'For identity verification'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-cyan-50 rounded-lg">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-lg flex-shrink-0">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-base">
                {language === 'ar' ? 'الوصول إلى الموقع' : 'Location Access'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'للمساعدة القائمة على الموقع' : 'For location-based assistance'}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={requestPermissions}
          disabled={isRequesting}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-base hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
        >
          {isRequesting 
            ? (language === 'ar' ? "جاري طلب الأذونات..." : "Requesting Permissions...")
            : (language === 'ar' ? "منح الأذونات" : "Grant Permissions")
          }
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
          {language === 'ar' 
            ? 'خصوصيتك محمية. البيانات تُستخدم فقط لأغراض أمنية.'
            : 'Your privacy is protected. Data is used only for security purposes.'
          }
        </p>
      </div>
    </div>
  );
}
