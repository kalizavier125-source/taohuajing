import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { connectDB } from './config/database'
import { analysisRouter } from './routes/analysis'
import { activateRouter } from './routes/activate'
import { uploadRouter } from './routes/upload'

dotenv.config()

const app = express()
const PORT = parseInt(process.env.PORT || '8000', 10)
const HOST = process.env.HOST || '0.0.0.0'

// 安全中间件
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP 100次请求
  message: { error: '请求过于频繁，请稍后再试' }
})
app.use(limiter)

// 解析JSON
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 连接数据库
connectDB()

// 路由
app.use('/api/v1/analysis', analysisRouter)
app.use('/api/v1/activate', activateRouter)
app.use('/api/v1/upload', uploadRouter)

// 健康检查
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, HOST, () => {
  console.log(`🌸 桃花镜后端服务运行在 http://${HOST}:${PORT}`)
})

export default app