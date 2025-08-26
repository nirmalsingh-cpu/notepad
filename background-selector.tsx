'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Palette, Link, Check, X } from 'lucide-react';

interface BackgroundSelectorProps {
  currentBackground: string;
  onBackgroundChange: (imageUrl: string) => void;
}

interface PresetBackground {
  id: string;
  name: string;
  url: string;
  category: string;
}

const presetBackgrounds: PresetBackground[] = [
  {
    id: '1',
    name: 'Mountain Sunrise',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    category: 'nature'
  },
  {
    id: '2',
    name: 'Ocean Waves',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    category: 'nature'
  },
  {
    id: '3',
    name: 'Forest Path',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    category: 'nature'
  },
  {
    id: '4',
    name: 'City Lights',
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    category: 'urban'
  },
  {
    id: '5',
    name: 'Purple Gradient',
    url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    category: 'abstract'
  },
  {
    id: '6',
    name: 'Cosmic Nebula',
    url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    category: 'space'
  },
  {
    id: '7',
    name: 'Cherry Blossoms',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    category: 'nature'
  },
  {
    id: '8',
    name: 'Golden Hour',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    category: 'nature'
  }
];

const gradientBackgrounds = [
  { name: 'Purple Dream', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Ocean Blue', value: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)' },
  { name: 'Sunset Orange', value: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)' },
  { name: 'Forest Green', value: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)' },
  { name: 'Rose Gold', value: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)' },
  { name: 'Dark Space', value: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)' }
];

export function BackgroundSelector({ currentBackground, onBackgroundChange }: BackgroundSelectorProps): JSX.Element {
  const [customUrl, setCustomUrl] = useState<string>('');
  const [urlPreview, setUrlPreview] = useState<string>('');
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);

  const handleCustomUrlChange = (url: string): void => {
    setCustomUrl(url);
    
    if (url.trim()) {
      const isValid = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url.trim());
      setIsValidUrl(isValid);
      if (isValid) {
        setUrlPreview(url.trim());
      }
    } else {
      setIsValidUrl(false);
      setUrlPreview('');
    }
  };

  const applyCustomBackground = (): void => {
    if (isValidUrl && customUrl.trim()) {
      onBackgroundChange(customUrl.trim());
      setCustomUrl('');
      setUrlPreview('');
      setIsValidUrl(false);
    }
  };

  const clearBackground = (): void => {
    onBackgroundChange('');
  };

  const categories = ['all', ...new Set(presetBackgrounds.map(bg => bg.category))];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBackgrounds = selectedCategory === 'all' 
    ? presetBackgrounds 
    : presetBackgrounds.filter(bg => bg.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Background Settings</h2>
        </div>
        {currentBackground && (
          <Button 
            variant="outline" 
            onClick={clearBackground}
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Background
          </Button>
        )}
      </div>

      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="gradients">Gradients</TabsTrigger>
          <TabsTrigger value="custom">Custom URL</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
                {category === 'all' && (
                  <Badge variant="secondary" className="ml-2">
                    {presetBackgrounds.length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Preset Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBackgrounds.map(background => (
              <Card 
                key={background.id}
                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                  currentBackground === background.url 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:ring-1 hover:ring-gray-300'
                }`}
                onClick={() => onBackgroundChange(background.url)}
              >
                <div className="relative aspect-video rounded-t-lg overflow-hidden">
                  <img 
                    src={background.url} 
                    alt={background.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {currentBackground === background.url && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="bg-blue-500 text-white rounded-full p-2">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{background.name}</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {background.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gradients" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradientBackgrounds.map((gradient, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                  currentBackground === gradient.value 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:ring-1 hover:ring-gray-300'
                }`}
                onClick={() => onBackgroundChange(gradient.value)}
              >
                <div 
                  className="h-24 rounded-t-lg relative"
                  style={{ background: gradient.value }}
                >
                  {currentBackground === gradient.value && (
                    <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                      <div className="bg-white text-gray-800 rounded-full p-2">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">{gradient.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Link className="w-5 h-5" />
                Custom Image URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={customUrl}
                  onChange={(e) => handleCustomUrlChange(e.target.value)}
                  className={
                    customUrl.trim() 
                      ? isValidUrl 
                        ? 'border-green-300 focus:border-green-500' 
                        : 'border-red-300 focus:border-red-500'
                      : ''
                  }
                />
                {customUrl.trim() && !isValidUrl && (
                  <p className="text-sm text-red-600">
                    Please enter a valid image URL (jpg, png, gif, webp)
                  </p>
                )}
                {isValidUrl && (
                  <p className="text-sm text-green-600">
                    ✓ Valid image URL detected
                  </p>
                )}
              </div>

              {urlPreview && (
                <div className="space-y-2">
                  <h4 className="font-medium">Preview:</h4>
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <img 
                      src={urlPreview} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setIsValidUrl(false)}
                    />
                  </div>
                </div>
              )}

              <Button 
                onClick={applyCustomBackground}
                disabled={!isValidUrl}
                className="w-full"
              >
                Apply Background
              </Button>

              <div className="text-sm text-gray-500 space-y-1">
                <p><strong>Tips:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use high-resolution images (1920x1080 or larger)</li>
                  <li>Supported formats: JPG, PNG, GIF, WebP</li>
                  <li>Make sure the URL is publicly accessible</li>
                  <li>Consider using image hosting services like Unsplash or Imgur</li>
                </ul>
              </div>
            </CardContent>
