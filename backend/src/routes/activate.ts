import { Router } from 'express'
import { ActivationCode } from '../models/ActivationCode'
import { v4 as uuidv4 } from 'uuid'

export const activateRouter = Router()

// 验证激活码
activateRouter.post('/validate', async (req, res) => {
  try {
    const { code } = req.body
    
    if (!code) {
      return res.status(400).json({ error: '请提供激活码' })
    }
    
    // 测试激活码
    if (code === '8888') {
      return res.json({ 
        valid: true,
        message: '测试激活码有效'
      })
    }
    
    const activationCode = await ActivationCode.findOne({ code })
    
    if (!activationCode) {
      return res.status(404).json({ error: '激活码不存在' })
    }
    
    if (activationCode.status === 'used') {
      return res.status(400).json({ error: '激活码已被使用' })
    }
    
    if (activationCode.status === 'expired') {
      return res.status(400).json({ error: '激活码已过期' })
    }
    
    res.json({ 
      valid: true,
      message: '激活码有效'
    })
  } catch (error) {
    console.error('验证激活码错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 使用激活码
activateRouter.post('/use', async (req, res) => {
  try {
    const { code, analysisId } = req.body
    
    if (!code) {
      return res.status(400).json({ error: '请提供激活码' })
    }
    
    // 测试激活码直接通过
    if (code === '8888') {
      return res.json({ 
        success: true,
        message: '测试激活码使用成功'
      })
    }
    
    const activationCode = await ActivationCode.findOne({ code })
    
    if (!activationCode) {
      return res.status(404).json({ error: '激活码不存在' })
    }
    
    if (activationCode.status === 'used') {
      return res.status(400).json({ error: '激活码已被使用' })
    }
    
    // 标记为已使用
    activationCode.status = 'used'
    activationCode.usedAt = new Date()
    if (analysisId) {
      activationCode.analysisId = analysisId
    }
    await activationCode.save()
    
    res.json({ 
      success: true,
      message: '激活码使用成功'
    })
  } catch (error) {
    console.error('使用激活码错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})

// 批量生成激活码（管理接口）
activateRouter.post('/generate', async (req, res) => {
  try {
    const { count = 100 } = req.body
    
    const codes = []
    for (let i = 0; i < count; i++) {
      const code = uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()
      codes.push({ code, status: 'unused' })
    }
    
    await ActivationCode.insertMany(codes)
    
    res.json({
      success: true,
      message: `成功生成 ${count} 个激活码`,
      codes: codes.map(c => c.code)
    })
  } catch (error) {
    console.error('生成激活码错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})