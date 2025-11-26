import { useState } from "react";
import { ArrowLeft, Send, Bot } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AIAssistantProps {
  onBack: () => void;
  language: 'ar' | 'en';
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function AIAssistant({ onBack, language }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: language === 'ar' 
        ? "مرحباً! أنا مساعدك في الأمن السيبراني. يمكنني مساعدتك في أسئلة حول الأمان الإلكتروني وحماية البيانات وأفضل ممارسات الأمن السيبراني. كيف يمكنني مساعدتك اليوم؟"
        : "Hello! I'm your cybersecurity assistant. I can help you with questions about online safety, data protection, and cybersecurity best practices. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const chatWithAI = useAction(api.ai.chatWithAI);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      const response = await chatWithAI({ message: inputMessage });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI chat error:", error);
      toast.error(language === 'ar' ? "فشل في الحصول على رد الذكي الاصطناعي. يرجى المحاولة مرة أخرى." : "Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="bg-white rounded-xl shadow-lg h-[80vh] max-h-[600px] flex flex-col">
        <div className="flex items-center p-4 sm:p-6 border-b border-gray-200">
          <button
            onClick={onBack}
            className="mr-4 p-3 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-lg">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                {language === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'خبير الأمن السيبراني' : 'Cybersecurity Expert'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-lg ${
                  message.isUser
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.isUser ? 'text-cyan-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={language === 'ar' ? "اسألني عن الأمن السيبراني..." : "Ask me about cybersecurity..."}
              className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent touch-manipulation"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
