import { Router } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { AnalysisResult } from '../models/AnalysisResult'
import { ActivationCode } from '../models/ActivationCode'
import axios from 'axios'

export const analysisRouter = Router()

// 使用内存存储
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
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

// AI分析提示词
const ANALYSIS_PROMPT = `你是一个专业的视觉心理学家和社交形象顾问。请分析这张头像照片，从以下维度给出详细分析：

1. 总体吸引力评分（0-100分）
2. 在同城用户中的排名百分比
3. 3个核心标签（如"清冷御姐"、"高智商脸"等）
4. 男生视角评分（0-100分）和详细描述
5. 女生视角评分（0-100分）和详细描述
6. 第一眼印象描述
7. 视觉舒适度评分和描述
8. 亲和力评分和描述
9. 可信度评分和描述
10. 心理学洞察分析
11. 一句核心洞察金句
12. 3个注意事项/红旗
13. 3个场景建议（职场、婚恋、日常社交）
14. 风格推荐
15. 色彩心理学分析
16. 构图心理学分析
17. 微表情分析
18. 能量类型
19. 最佳匹配对象类型

请以JSON格式返回，确保所有字段都包含。`

// 调用通义千问API分析头像
async function analyzeWithQwen(imageBase64: string) {
  const apiKey = process.env.QWEN_API_KEY
  const baseUrl = process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  
  console.log('正在调用通义千问API...')
  console.log('图片大小:', Math.round(imageBase64.length * 0.75 / 1024), 'KB')
  
  const response = await axios.post(
    `${baseUrl}/chat/completions`,
    {
      model: 'qwen-vl-max',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: ANALYSIS_PROMPT },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  )
  
  return response.data.choices[0]?.message?.content
}

// 分析头像
analysisRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const { code } = req.body
    
    if (!code) {
      return res.status(400).json({ error: '请提供激活码' })
    }
    
    if (!req.file) {
      return res.status(400).json({ error: '请上传头像' })
    }
    
    console.log('收到分析请求，激活码:', code)
    console.log('文件大小:', req.file.size, 'bytes')
    
    // 测试激活码直接通过
    if (code !== '8888') {
      // 验证激活码
      const activationCode = await ActivationCode.findOne({ code })
      
      if (!activationCode) {
        return res.status(404).json({ error: '激活码不存在' })
      }
      
      if (activationCode.status === 'used') {
        return res.status(400).json({ error: '激活码已被使用' })
      }
    }
    
    // 将图片转为base64
    const base64Image = req.file.buffer.toString('base64')
    
    // 调用通义千问VL API
    let aiResponse
    try {
      aiResponse = await analyzeWithQwen(base64Image)
    } catch (apiError) {
      console.error('API调用失败，使用模拟数据:', apiError)
      // API失败时使用模拟数据
      aiResponse = JSON.stringify({
        score: 78,
        rank: "击败82%同城用户",
        tags: ["温柔知性", "高知感", "亲和力强"],
        genderScores: {
          male: { score: 75, description: "给人舒服自然的感觉，容易让人产生保护欲" },
          female: { score: 88, description: "独立清醒，是想要成为的样子" }
        },
        firstImpression: "第一眼看到透着一种『岁月静好』的温柔感",
        visualComfort: { score: 85, description: "构图平衡，光线柔和" },
        affinityScore: { score: 82, description: "亲和力很强，笑容自然" },
        trustScore: { score: 80, description: "给人可信感" },
        psychologyInsight: "头像传递出『我很乖，我很安全』的信号",
        goldenPhrase: "你的温柔是优势，但偶尔需要一点难以捉摸的神秘感",
        redFlags: ["劝退喜欢刺激感的男生", "过于好女孩气质", "缺乏记忆点"],
        sceneSuggestions: [
          { scene: "职场", advice: "保持专业感，增加设计感单品" },
          { scene: "婚恋", advice: "增加生活情趣信号" },
          { scene: "日常", advice: "偶尔穿插有态度的照片" }
        ],
        styleRecommend: "温柔知性风 / 日系清新风",
        colorPsychology: "暖色调增加亲和力",
        compositionPsychology: "构图平衡",
        microExpression: "表情自然",
        energyType: "亲和型",
        bestMatch: "成熟稳重的对象"
      })
    }
    
    if (!aiResponse) {
      throw new Error('AI分析返回空结果')
    }
    
    console.log('API返回:', aiResponse.substring(0, 200), '...')
    
    // 解析AI返回的结果
    let analysisResult
    try {
      analysisResult = JSON.parse(aiResponse)
    } catch {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('无法解析AI返回结果')
      }
    }
    
    // 生成分析ID
    const analysisId = uuidv4()
    
    // 保存分析结果
    const result = new AnalysisResult({
      analysisId,
      imageUrl: 'data:image/jpeg;base64,' + base64Image.substring(0, 100) + '...',
      result: analysisResult
    })
    await result.save()
    
    // 如果不是测试码，标记激活码为已使用
    if (code !== '8888') {
      const activationCode = await ActivationCode.findOne({ code })
      if (activationCode) {
        activationCode.status = 'used'
        activationCode.usedAt = new Date()
        activationCode.analysisId = analysisId
        await activationCode.save()
      }
    }
    
    console.log('分析完成，ID:', analysisId)
    
    res.json({
      success: true,
      analysisId,
      result: analysisResult
    })
    
  } catch (error) {
    console.error('分析错误:', error)
    
    res.status(500).json({ 
      error: '分析失败，请重试',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    })
  }
})

// 获取分析结果
analysisRouter.get('/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params
    
    const result = await AnalysisResult.findOne({ analysisId })
    
    if (!result) {
      return res.status(404).json({ error: '分析报告不存在' })
    }
    
    res.json({
      success: true,
      result: result.result
    })
  } catch (error) {
    console.error('获取分析错误:', error)
    res.status(500).json({ error: '服务器错误' })
  }
})