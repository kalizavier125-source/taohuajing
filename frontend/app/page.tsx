'use client'
// @ts-nocheck

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Shield, Heart, Camera, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

// 庆祝动效组件 - P4优化：减少emoji数量和种类
function CelebrationEffect({ show }: { show: boolean }) {
  if (!show) return null
  
  const emojis = ['🎉', '✨', '🌸']
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: '50%',
            y: '50%',
            scale: 0
          }}
          animate={{ 
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
            scale: [0, 1, 0],
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: 1 + Math.random(),
            ease: 'easeOut'
          }}
        >
          <span className="text-2xl">{emojis[i % 3]}</span>
        </motion.div>
      ))}
    </div>
  )
}

// 按钮涟漪效果组件
function RippleButton({ children, onClick, className, disabled }: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    
    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 600)
    
    onClick?.()
  }
  
  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      whileTap={{ scale: 0.98 }}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
      {children}
    </motion.button>
  )
}
function FloatingPetals() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-200/15"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: '110%',
            rotate: 0,
            scale: 0.5 + Math.random() * 0.5
          }}
          animate={{ 
            y: '-10%',
            rotate: 360,
            x: `${Math.floor(Math.random() * 100)}%`
          }}
          transition={{ 
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'linear'
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  )
}

// 加载动画组件 - P0优化：卡片式居中设计
function LoadingAnimation() {
  return (
    <motion.div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* 分析图标动画 */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.div
            className="absolute -inset-2 border-2 border-dashed border-pink-200 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            AI正在分析中...
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            正在从心理学、美学、社交吸引力等维度深度解读
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 12, ease: 'easeInOut' }}
            />
          </div>
          
          <motion.div
            className="flex justify-between mt-2 text-xs text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>分析五官特征...</span>
            <span>预计10秒</span>
          </motion.div>
        </div>
        
        <motion.div
          className="mt-4 p-3 bg-pink-50 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xs text-pink-600 text-center">
            💡 小提示：头像的背景、光线、表情都会影响分析结果哦
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  const [activateCode, setActivateCode] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  })

  const handleAnalyze = async () => {
    if (!activateCode.trim()) {
      alert('请输入激活码')
      return
    }
    if (!uploadedFile) {
      alert('请上传头像')
      return
    }

    // 显示庆祝动效
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 1500)

    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      router.push('/report/demo')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 relative">
      <FloatingPetals />
      <CelebrationEffect show={showCelebration} />
      
      <AnimatePresence>
        {isLoading && <LoadingAnimation />}
      </AnimatePresence>
      
      <div className="relative z-10 max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col">
        
        {/* Header - P1优化：小红书风格标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-1.5 rounded-full text-sm mb-4 shadow-lg shadow-pink-200"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>✨ AI 头像社交力诊断</span>
          </motion.div>
          
          <motion.h1
            className="text-4xl font-bold tracking-tight mb-1"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              🌸 桃花镜
            </span>
          </motion.h1>
          
          <p className="text-gray-500 text-sm">
            发现你的社交魅力值 · 解锁心动密码 💕
          </p>
        </motion.div>

        {/* 激活码输入 - P1优化：移动端input优化 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔑 激活码
          </label>
          <div className={`relative transition-all duration-300 ${isInputFocused ? 'transform scale-[1.02]' : ''}`}>
            <input
              type="text"
              value={activateCode}
              onChange={(e) => setActivateCode(e.target.value.toUpperCase())}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="输入16位激活码"
              maxLength={16}
              autoCapitalize="characters"
              inputMode="text"
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white/80 backdrop-blur-sm outline-none transition-all duration-300 ${
                isInputFocused 
                  ? 'border-pink-400 shadow-lg shadow-pink-200' 
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            />
            
            <AnimatePresence>
              {activateCode.length >= 16 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            在小红书店铺购买后获取激活码 📱
          </p>
        </motion.div>

        {/* 上传区域 - P1优化：增加active反馈 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📷 上传头像
          </label>
          
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
              isDragActive
                ? 'border-pink-500 bg-pink-50 scale-[1.02] shadow-xl shadow-pink-200'
                : 'border-gray-300 bg-white/60 hover:border-pink-400 hover:bg-pink-50/50'
            } active:scale-[0.98] active:bg-pink-100`}
          >
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative"
                >
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl mx-auto shadow-lg"
                  />
                  <motion.div
                    className="absolute -bottom-2 -right-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    ✓
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Camera className="w-8 h-8 text-pink-500" />
                  </motion.div>
                  
                  <p className="text-gray-600 mb-2">
                    {isDragActive ? '松开以上传 🎉' : '点击或拖拽上传头像'}
                  </p>
                  
                  <p className="text-xs text-gray-400">
                    支持 JPG、PNG、WebP 格式，最大 10MB
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 分析按钮 - P1优化：增加iPhone安全区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-auto pb-safe"
        >
          <RippleButton
            onClick={handleAnalyze}
            disabled={!activateCode || !uploadedFile}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              activateCode && uploadedFile
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-300'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>🚀 开始 AI 分析</span>
            <ArrowRight className="w-5 h-5" />
          </RippleButton>
          
          <div className="flex justify-center gap-6 mt-6 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>数据安全 🔒</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>隐私保护 💕</span>
            </div>
          </div>        
        </motion.div>
      </div>
    </div>
  )
}