"use client";

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/config/LanguageContext';
import { languageOptions } from '@/config/translations';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4 text-white/80" />
        <span className="text-sm font-medium text-white/90">{currentLanguage?.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-xl backdrop-blur-xl">
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                language === lang.code
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-xs text-ar-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
