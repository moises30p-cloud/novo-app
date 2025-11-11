'use client'

import { useState } from 'react'
import { Download, Scissors, Share2, Globe, Play, Clock, Link, Settings, ChevronDown, Copy, Check } from 'lucide-react'

interface VideoClip {
  id: string
  title: string
  platform: string
  duration: string
  startTime: string
  endTime: string
  url: string
  status: 'processing' | 'ready' | 'error'
}

const languages = {
  pt: {
    title: 'ClipMaster',
    subtitle: 'Baixe e corte vídeos das principais plataformas',
    urlPlaceholder: 'Cole o link do vídeo aqui...',
    supportedPlatforms: 'Plataformas suportadas',
    startTime: 'Tempo inicial',
    endTime: 'Tempo final',
    clipDuration: 'Duração do corte',
    downloadClip: 'Baixar Corte',
    shareClip: 'Compartilhar',
    processing: 'Processando...',
    ready: 'Pronto',
    error: 'Erro',
    myClips: 'Meus Cortes',
    noClips: 'Nenhum corte criado ainda',
    copied: 'Copiado!',
    copy: 'Copiar',
    settings: 'Configurações',
    language: 'Idioma',
    quality: 'Qualidade',
    format: 'Formato'
  },
  en: {
    title: 'ClipMaster',
    subtitle: 'Download and clip videos from major platforms',
    urlPlaceholder: 'Paste video link here...',
    supportedPlatforms: 'Supported platforms',
    startTime: 'Start time',
    endTime: 'End time',
    clipDuration: 'Clip duration',
    downloadClip: 'Download Clip',
    shareClip: 'Share',
    processing: 'Processing...',
    ready: 'Ready',
    error: 'Error',
    myClips: 'My Clips',
    noClips: 'No clips created yet',
    copied: 'Copied!',
    copy: 'Copy',
    settings: 'Settings',
    language: 'Language',
    quality: 'Quality',
    format: 'Format'
  },
  es: {
    title: 'ClipMaster',
    subtitle: 'Descarga y corta videos de las principales plataformas',
    urlPlaceholder: 'Pega el enlace del video aquí...',
    supportedPlatforms: 'Plataformas compatibles',
    startTime: 'Tiempo inicial',
    endTime: 'Tiempo final',
    clipDuration: 'Duración del corte',
    downloadClip: 'Descargar Corte',
    shareClip: 'Compartir',
    processing: 'Procesando...',
    ready: 'Listo',
    error: 'Error',
    myClips: 'Mis Cortes',
    noClips: 'Aún no se han creado cortes',
    copied: '¡Copiado!',
    copy: 'Copiar',
    settings: 'Configuración',
    language: 'Idioma',
    quality: 'Calidad',
    format: 'Formato'
  }
}

const platforms = [
  { name: 'YouTube', icon: '🎥', color: 'bg-red-500' },
  { name: 'TikTok', icon: '🎵', color: 'bg-black' },
  { name: 'Instagram', icon: '📸', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { name: 'Twitter', icon: '🐦', color: 'bg-blue-500' },
  { name: 'Facebook', icon: '👥', color: 'bg-blue-600' },
  { name: 'Twitch', icon: '🎮', color: 'bg-purple-600' }
]

export default function Home() {
  const [currentLang, setCurrentLang] = useState<keyof typeof languages>('pt')
  const [videoUrl, setVideoUrl] = useState('')
  const [startTime, setStartTime] = useState('00:00')
  const [endTime, setEndTime] = useState('01:00')
  const [clips, setClips] = useState<VideoClip[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const t = languages[currentLang]

  const calculateDuration = (start: string, end: string) => {
    const startSeconds = timeToSeconds(start)
    const endSeconds = timeToSeconds(end)
    const duration = endSeconds - startSeconds
    return secondsToTime(Math.max(0, duration))
  }

  const timeToSeconds = (time: string) => {
    const [minutes, seconds] = time.split(':').map(Number)
    return minutes * 60 + seconds
  }

  const secondsToTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCreateClip = () => {
    if (!videoUrl.trim()) return

    const newClip: VideoClip = {
      id: Date.now().toString(),
      title: 'Video Clip',
      platform: detectPlatform(videoUrl),
      duration: calculateDuration(startTime, endTime),
      startTime,
      endTime,
      url: videoUrl,
      status: 'processing'
    }

    setClips(prev => [newClip, ...prev])

    // Simular processamento
    setTimeout(() => {
      setClips(prev => prev.map(clip => 
        clip.id === newClip.id ? { ...clip, status: 'ready' } : clip
      ))
    }, 2000)

    // Limpar formulário
    setVideoUrl('')
    setStartTime('00:00')
    setEndTime('01:00')
  }

  const detectPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
    if (url.includes('tiktok.com')) return 'TikTok'
    if (url.includes('instagram.com')) return 'Instagram'
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter'
    if (url.includes('facebook.com')) return 'Facebook'
    if (url.includes('twitch.tv')) return 'Twitch'
    return 'Unknown'
  }

  const handleShare = async (clip: VideoClip) => {
    if (navigator.share) {
      await navigator.share({
        title: clip.title,
        text: `Confira este clipe de ${clip.duration}!`,
        url: clip.url
      })
    } else {
      // Fallback para copiar para área de transferência
      await navigator.clipboard.writeText(clip.url)
      setCopiedId(clip.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const getStatusColor = (status: VideoClip['status']) => {
    switch (status) {
      case 'processing': return 'text-yellow-500'
      case 'ready': return 'text-green-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusText = (status: VideoClip['status']) => {
    switch (status) {
      case 'processing': return t.processing
      case 'ready': return t.ready
      case 'error': return t.error
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase">{currentLang}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2 z-50">
                    <div className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                      {t.language}
                    </div>
                    {Object.keys(languages).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setCurrentLang(lang as keyof typeof languages)
                          setShowSettings(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          currentLang === lang ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {lang.toUpperCase()} - {lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-6 sm:p-8">
              <div className="space-y-6">
                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL do Vídeo
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder={t.urlPlaceholder}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Time Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.startTime}
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.endTime}
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t.clipDuration}
                    </label>
                    <div className="flex items-center justify-center h-12 px-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600">
                      <span className="text-lg font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {calculateDuration(startTime, endTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleCreateClip}
                  disabled={!videoUrl.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Scissors className="w-5 h-5" />
                  <span>{t.downloadClip}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Supported Platforms */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t.supportedPlatforms}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg ${platform.color} flex items-center justify-center text-white text-sm`}>
                      {platform.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {platform.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My Clips Section */}
        {clips.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.myClips}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {clip.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {clip.platform}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${getStatusColor(clip.status)}`}>
                      {getStatusText(clip.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{clip.startTime} - {clip.endTime}</span>
                    <span className="font-mono font-semibold">{clip.duration}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      disabled={clip.status !== 'ready'}
                      className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleShare(clip)}
                      disabled={clip.status !== 'ready'}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {copiedId === clip.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>{t.shareClip}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {clips.length === 0 && (
          <div className="mt-12 text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t.noClips}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Cole um link de vídeo acima para começar a criar seus cortes
            </p>
          </div>
        )}
      </main>
    </div>
  )
}