import { action } from "./_generated/server";
import { v } from "convex/values";

export const chatWithAI = action({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Using the bundled OpenAI API
    const baseUrl = process.env.CONVEX_OPENAI_BASE_URL || "https://api.openai.com/v1";
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: "You are a helpful cybersecurity assistant. Provide professional, accurate advice about cybersecurity, online safety, and digital privacy. Keep responses concise and actionable."
          },
          {
            role: "user",
            content: args.message
          }
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`Failed to get AI response: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
});

export const checkSuspiciousLink = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    // Basic URL validation and suspicious pattern detection
    const url = args.url.toLowerCase();
    
    const suspiciousPatterns = [
      'bit.ly', 'tinyurl', 'shortened',
      'phishing', 'malware', 'virus',
      'free-money', 'click-here', 'urgent',
      'verify-account', 'suspended',
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => 
      url.includes(pattern)
    );
    
    // Check for HTTPS
    const hasHttps = url.startsWith('https://');
    
    // Basic domain validation
    const hasValidDomain = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(url);
    
    let riskLevel = 'low';
    let warnings = [];
    
    if (isSuspicious) {
      riskLevel = 'high';
      warnings.push('Contains suspicious keywords');
    }
    
    if (!hasHttps) {
      riskLevel = riskLevel === 'high' ? 'high' : 'medium';
      warnings.push('Not using secure HTTPS connection');
    }
    
    if (!hasValidDomain) {
      riskLevel = 'high';
      warnings.push('Invalid or malformed domain');
    }
    
    return {
      url: args.url,
      riskLevel,
      warnings,
      recommendation: riskLevel === 'high' 
        ? 'Do not click this link. It appears to be suspicious.'
        : riskLevel === 'medium'
        ? 'Exercise caution. This link has some risk factors.'
        : 'This link appears to be safe, but always verify the source.'
    };
  },
});
