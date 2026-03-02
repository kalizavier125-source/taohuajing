import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'

export const uploadRouter = Router()

// 临时存储配置（用于预览）
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = './uploads/temp'
    try {
      await fs.mkdir(uploadDir, { recursive: true })
      cb(null, uploadDir)
    } catch (error) {
      cb(error as Error, uploadDir)
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `temp_${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('只支持 JPG、PNG、WebP 格式'))
    }
  }
})

// 上传预览图
uploadRouter.post('/preview', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片' })
    }
    
    // 返回临时URL
    const imageUrl = `/uploads/temp/${path.basename(req.file.path)}`
    
    res.json({
      success: true,
      url: imageUrl,
      filename: path.basename(req.file.path)
    })
  } catch (error) {
    console.error('上传错误:', error)
    res.status(500).json({ error: '上传失败' })
  }
})

// 删除临时文件
uploadRouter.delete('/temp/:filename', async (req, res) => {
  try {
    const { filename } = req.params
    const filePath = `./uploads/temp/${filename}`
    
    try {
      await fs.unlink(filePath)
      res.json({ success: true, message: '文件已删除' })
    } catch {
      res.status(404).json({ error: '文件不存在' })
    }
  } catch (error) {
    console.error('删除错误:', error)
    res.status(500).json({ error: '删除失败' })
  }
})