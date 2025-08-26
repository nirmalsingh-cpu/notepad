'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NoteManager } from '@/components/note-manager';
import { Calculator } from '@/components/calculator';
import { BackgroundSelector } from '@/components/background-selector';
import { Card } from '@/components/ui/card';
import { Sparkles, Calculator as CalcIcon, Image as ImageIcon, FileText } from 'lucide-react';

interface BackgroundImage {
  id: string;
  name: string;
  url: string;
}

export default function LummuApp(): JSX.Element {
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    const savedBackground = localStorage.getItem('lummu-background');
    if (savedBackground) {
      setBackgroundImage(savedBackground);
    }
  }, []);

  const handleBackgroundChange = (imageUrl: string): void => {
    setBackgroundImage(imageUrl);
    localStorage.setItem('lummu-background', imageUrl);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                Lummu
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>
            <p className="text-lg text-white/90 drop-shadow-md">
              Your personal note-taking and productivity companion
            </p>
          </div>

          {/* Main Content */}
          <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-0">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Notes</span>
                </TabsTrigger>
                <TabsTrigger value="calculator" className="flex items-center gap-2">
                  <CalcIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Calculator</span>
                </TabsTrigger>
                <TabsTrigger value="background" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Background</span>
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="notes" className="mt-0">
                  <NoteManager />
                </TabsContent>

                <TabsContent value="calculator" className="mt-0">
                  <div className="flex justify-center">
                    <Calculator />
                  </div>
                </TabsContent>

                <TabsContent value="background" className="mt-0">
                  <BackgroundSelector 
                    currentBackground={backgroundImage}
                    onBackgroundChange={handleBackgroundChange}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-white/70 text-sm drop-shadow-md">
              Made with ✨ for productivity and creativity
            </p>
          </div>
        </div>
