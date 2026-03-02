'use client'
// @ts-nocheck

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion'
import { 
  Sparkles, 
  Heart, 
  Shield, 
  AlertTriangle, 
  Lightbulb,
  Camera,
  Palette,
  Users,
  Download,
  Share2,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'
import html2canvas from 'html2canvas'

// 雷达图组件
function RadarChart({ data, size = 150 }: { data: number[]; size?: number }) {
  const center = size / 2
  const radius = size * 0.35
  const labels = ['颜值', '亲和', '信任', '专业', '个性']
  
  const points = data.map((value, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180)
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    }
  })
  
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  
  return (
    <svg width={size} height={size} className="mx-auto">
      {/* 背景网格 */}
      {[20, 40, 60, 80, 100].map((level) => {
        const levelRadius = (level / 100) * radius
        const levelPoints = labels.map((_, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180)
          return {
            x: center + levelRadius * Math.cos(angle),
            y: center + levelRadius * Math.sin(angle)
          }
        })
        const levelPath = levelPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
        
        return (
          <path
            key={level}
            d={levelPath}
            fill="none"
            stroke="#fce7f3"
            strokeWidth={1}
          />
        )
      })}
      
      {/* 轴线 */}
      {labels.map((_, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180)
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#fce7f3"
            strokeWidth={1}
          />
        )
      })}
      
      {/* 数据区域 */}
      <motion.path
        d={pathData}
        fill="url(#gradient)"
        fillOpacity={0.6}
        stroke="#ec4899"
        strokeWidth={2}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      
      {/* 数据点 */}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          fill="#ec4899"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      ))}
      
      {/* 标签 - P4优化：字体加大 */}
      {labels.map((label, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180)
        const x = center + (radius + 20) * Math.cos(angle)
        const y = center + (radius + 20) * Math.sin(angle)
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-gray-600 font-medium"
          >
            {label}
          </text>
        )
      })}
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// 击败用户进度条
function RankProgressBar({ rank }: { rank: string }) {
  // 解析击败百分比
  const match = rank.match(/(\d+)%/)
  const percentage = match ? parseInt(match[1]) : 85
  
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">👥 超过同地区用户</span>
        <span className="text-lg font-bold text-rose-600">{percentage}%</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        >
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-rose-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2 }}
          />
        </motion.div>
      </div>      
    </div>
  )
}

// 手风琴组件
function AccordionCard({ title, children, gradient, delay = 0 }: { 
  title: string
  children: React.ReactNode
  gradient: string
  delay?: number 
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <motion.div
      className={`bg-gradient-to-br ${gradient} rounded-2xl overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <motion.button
        className="w-full p-4 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
      >
        <h4 className="text-sm font-bold text-gray-700">{title}</h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
function AnimatedNumber({ value, duration = 2 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      // 缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(Math.floor(easeOutQuart * value))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])
  
  return <span>{displayValue}</span>
}

// 分数圆环组件
function ScoreRing({ score, size = 120, strokeWidth = 8 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
        />
        {/* 进度圆环 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold text-white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <AnimatedNumber value={score} />
        </motion.span>
        <span className="text-xs text-white/80">总分</span>
      </div>
    </div>
  )
}

// 卡片组件 - P1优化：毛玻璃效果升级
function Card({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-pink-100/30 border border-white/50 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(255, 107, 157, 0.2)' }}
    >
      {children}
    </motion.div>
  )
}

// 标签组件 - P4优化：增强hover效果
function Tag({ children, color = 'pink' }: { children: React.ReactNode; color?: 'pink' | 'blue' | 'purple' | 'green' }) {
  const colorClasses = {
    pink: 'bg-gradient-to-r from-pink-400 to-rose-400 shadow-pink-300/50',
    blue: 'bg-gradient-to-r from-blue-400 to-cyan-400 shadow-blue-300/50',
    purple: 'bg-gradient-to-r from-purple-400 to-violet-400 shadow-purple-300/50',
    green: 'bg-gradient-to-r from-green-400 to-emerald-400 shadow-green-300/50'
  }
  
  return (
    <motion.span
      className={`${colorClasses[color]} text-white px-3 py-1 rounded-full text-sm font-medium cursor-pointer shadow-lg`}
      whileHover={{ 
        scale: 1.08, 
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        y: -2
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      {children}
    </motion.span>
  )
}

// 模拟报告数据
const reportData = {
  score: 82,
  rank: "击败85%同城用户",
  tags: ["清冷御姐", "高智商脸", "生人勿近"],
  genderScores: {
    male: {
      score: 68,
      description: "在他眼中，你是高不可攀的女神，美得让人不敢搭讪，容易劝退内向但优质的男生"
    },
    female: {
      score: 90,
      description: "在她眼中，你是独立清醒的大女主，是想要成为的样子"
    }
  },
  firstImpression: "第一眼看到你，透着一种『我在思考，别打扰』的疏离感🧊。构图干净，衣着有质感，显示出你对生活有要求，是个自律的女生。但在异性初识时，这种清冷可能被误读为『高傲』。",
  visualComfort: {
    score: 90,
    description: "构图干净，背景不杂乱，衣着有质感，显示出你是一个对生活有要求、自律的女生。"
  },
  affinityScore: {
    score: 65,
    description: "眼神过于犀利直视镜头，缺乏『情绪钩子』。异性看到你的第一反应往往是『这个女生很难追』或『她可能看不上我』，从而不敢主动搭讪。"
  },
  trustScore: {
    score: 88,
    description: "展现出的气质独立成熟，容易吸引想要寻找长期伴侣的稳重男性，而非只想玩玩的『海王』。"
  },
  psychologyInsight: "你的头像像一张完美的『防御盾牌』🛡️。虽然美感十足，但缺乏『互动邀请感』。男性在浏览头像时，潜意识在寻找『可得性』。你现在的眼神像是在面试对方，而不是在邀请对方认识。",
  goldenPhrase: "你的头像是一张防御盾牌，挡住了优质男的勇气",
  redFlags: [
    "❌ 劝退类型：性格内向或自信心不足的优质男",
    "❌ 潜在误解：容易被误读为『高冷』或『不好相处』",
    "❌ 社交成本：需要对方有更强的主动性才敢接近"
  ],
  sceneSuggestions: [
    {
      scene: "职场社交",
      advice: "保持现有专业感，但可以增加一点个人特色。比如佩戴一个有设计感的耳环，或选择更有质感的背景（咖啡厅、书店）。"
    },
    {
      scene: "婚恋平台",
      advice: "增加一点'生活情趣'的信号。比如手持一杯咖啡、一本书，或背景有绿植。暗示你不仅专业，也有柔软的一面。"
    },
    {
      scene: "日常社交",
      advice: "可以保留高冷感，但偶尔穿插一些'有温度'的照片。比如侧脸轮廓、背影、或专注做某事的瞬间，展现多面性。"
    }
  ],
  styleRecommend: "职场精英风 / 知性清冷风",
  colorPsychology: "冷色调（蓝、灰、白）：传递专业、理性、高级感❄️。建议偶尔加入一点暖色元素（如唇色、配饰），增加亲和力。",
  compositionPsychology: "居中构图，正面直视：表现出自信、专业、有主见。但可以尝试45度侧脸或微侧身，增加柔和感。",
  microExpression: "眼神直视，嘴角平直：传递出『我很强』的信号。如果想增加亲和力，可以尝试轻微侧头或嘴角上扬5度。",
  energyType: "独立自信型",
  bestMatch: "成熟稳重、有主见、不畏惧挑战的男性"
}

export default function ReportPage() {
  const reportRef = useRef<HTMLDivElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8])
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const handleDownload = async () => {
    if (!reportRef.current) return
    
    setIsCapturing(true)
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#fdf2f8',
        logging: false
      })
      
      const link = document.createElement('a')
      link.download = `桃花镜-头像诊断报告-${new Date().toLocaleDateString()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('截图失败:', error)
      alert('截图失败，请重试')
    } finally {
      setIsCapturing(false)
    }
  }
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '桃花镜 - 我的头像诊断报告',
        text: `我的头像得分${reportData.score}分，击败了${reportData.rank}！`,
        url: window.location.href
      })
    } else {
      alert('分享功能需要HTTPS环境')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 pb-24">
      {/* 顶部导航 - P4优化：添加滚动进度条  */}
      <motion.header
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100"
        style={{ opacity: headerOpacity }}
      >
        <div className="px-4 py-3">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <motion.button
              className="p-2 hover:bg-pink-50 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="font-medium text-gray-800">诊断报告</span>
            </div>
            
            <div className="w-10" />
          </div>
        </div>
        
        {/* 滚动进度条  */}
        <motion.div
          className="h-0.5 bg-gradient-to-r from-pink-400 to-rose-500 origin-left"
          style={{ scaleX }}
        />
      </motion.header>

      <div ref={reportRef} className="max-w-md mx-auto px-5 py-6 space-y-8">
        
        {/* 视觉分隔线  */}
        <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
        
        {/* Header Score Section  */}
        <motion.section
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 背景装饰  */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          
          <div className="relative text-center">
            <motion.div
              className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-3 h-3" />
              AI 深度分析报告
            </motion.div>
            
            <div className="flex justify-center mb-4">
              <ScoreRing score={reportData.score} />
            </div>
            
            <motion.p
              className="text-lg font-medium mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {reportData.rank}
            </motion.p>
            
            {/* 击败用户进度条 */}
            <RankProgressBar rank={reportData.rank} />
            
            {/* 雷达图 */}
            <motion.div
              className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-xs text-white/80 mb-2">五维能力分析</p>
              <RadarChart data={[82, 65, 88, 90, 75]} size={200} />
            </motion.div>
            
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {reportData.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.1, type: 'spring' }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Gender Scores  */}
        <Card delay={0.1}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-pink-500" />
              <h3 className="font-bold text-gray-800">不同性别眼中的你</h3>
            </div>
            
            <div className="space-y-3">
              {/* Male Perspective  */}
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">男生视角</span>
                  <motion.span
                    className="text-2xl font-bold text-blue-500"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {reportData.genderScores.male.score}分
                  </motion.span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {reportData.genderScores.male.description}
                </p>
              </motion.div>
              
              {/* Female Perspective  */}
              <motion.div
                className="bg-gradient-to-r from-pink-50 to-rose-100 rounded-xl p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">女生视角</span>
                  <motion.span
                    className="text-2xl font-bold text-pink-500"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {reportData.genderScores.female.score}分
                  </motion.span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {reportData.genderScores.female.description}
                </p>
              </motion.div>
            </div>
          </div>
        </Card>

        {/* First Impression  */}
        <Card delay={0.2}>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-pink-500" />
              <h3 className="font-bold text-gray-800">第一眼印象</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {reportData.firstImpression}
            </p>
          </div>
        </Card>

        {/* Detailed Scores  */}
        <section className="space-y-3">
          <motion.h3
            className="font-bold text-gray-800 flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Heart className="w-5 h-5 text-pink-500" />
            详细评分
          </motion.h3>
          
          {[
            { label: '视觉舒适度', score: reportData.visualComfort.score, desc: reportData.visualComfort.description, color: 'bg-green-500' },
            { label: '亲和力', score: reportData.affinityScore.score, desc: reportData.affinityScore.description, color: 'bg-yellow-500' },
            { label: '可信度', score: reportData.trustScore.score, desc: reportData.trustScore.description, color: 'bg-blue-500' }
          ].map((item, i) => (
            <Card key={item.label} delay={0.3 + i * 0.1}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-lg font-bold text-gray-800">{item.score}分</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className={`h-full ${item.color} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.score}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  />
                </div>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </Card>
          ))}
        </section>

        {/* Psychology Insight  */}
        <Card delay={0.5} className="bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold text-gray-800">心理学洞察</h3>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {reportData.psychologyInsight}
            </p>
            
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-4 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-xs opacity-80 mb-1">💡 核心洞察</p>
              <p className="text-base font-bold">{reportData.goldenPhrase}</p>
            </motion.div>
          </div>
        </Card>

        {/* Red Flags  */}
        <Card delay={0.6} className="bg-red-50">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-red-800">注意事项</h3>
            </div>
            
            <div className="space-y-2">
              {reportData.redFlags.map((flag, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-lg p-3 flex items-start gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <span className="text-red-500 mt-0.5">•</span>
                  <p className="text-sm text-gray-600">{flag}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* 视觉分隔线  */}
        <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

        {/* Scene Suggestions - P0优化：手风琴折叠  */}
        <section className="space-y-3">
          <motion.h3
            className="font-bold text-gray-800 flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Palette className="w-5 h-5 text-pink-500" />
            🎨 场景建议（点击展开）
          </motion.h3>
          
          <AccordionCard title="💼 职场社交" gradient="from-blue-50 to-cyan-50" delay={0.8}>
            <p className="text-sm text-gray-600 leading-relaxed">{reportData.sceneSuggestions[0].advice}</p>
          </AccordionCard>
          
          <AccordionCard title="💕 婚恋平台" gradient="from-pink-50 to-rose-50" delay={0.9}>
            <p className="text-sm text-gray-600 leading-relaxed">{reportData.sceneSuggestions[1].advice}</p>
          </AccordionCard>
          
          <AccordionCard title="🌟 日常社交" gradient="from-green-50 to-emerald-50" delay={1.0}>
            <p className="text-sm text-gray-600 leading-relaxed">{reportData.sceneSuggestions[2].advice}</p>
          </AccordionCard>
        </section>

        {/* Style Recommend  */}
        <Card delay={1}>
          <div className="p-5">
            <motion.div
              className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl p-4 mb-4 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-lg font-bold text-pink-700">{reportData.styleRecommend}</p>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <motion.div
                className="bg-gray-50 rounded-lg p-3"
                whileHover={{ backgroundColor: 'rgb(254, 242, 244)' }}
              >
                <p className="text-gray-500 mb-1">能量类型</p>
                <p className="font-bold text-gray-700">{reportData.energyType}</p>
              </motion.div>
              
              <motion.div
                className="bg-gray-50 rounded-lg p-3"
                whileHover={{ backgroundColor: 'rgb(254, 242, 244)' }}
              >
                <p className="text-gray-500 mb-1">最佳匹配</p>
                <p className="font-bold text-gray-700">{reportData.bestMatch}</p>
              </motion.div>
            </div>          
          </div>
        </Card>

        {/* Footer  */}
        <motion.div
          className="text-center pt-6 pb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs text-gray-400">
            由 桃花镜 AI 生成 · 仅供参考娱乐
          </p>
        </motion.div>
      </div>

      {/* Bottom Action Bar - P1优化：增加iPhone安全区  */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-pink-100 p-4 pb-safe z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="max-w-md mx-auto flex gap-3">
          <motion.button
            onClick={handleDownload}
            disabled={isCapturing}
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-200"
            whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(255, 107, 157, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            {isCapturing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>保存报告</span>
              </>
            )}
          </motion.button>
          
          <motion.button
            onClick={handleShare}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}