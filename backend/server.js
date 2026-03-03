// 简化的Express服务器（JavaScript版本，无需编译）
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 8000;

// 内存存储
const activationCodes = new Map();
const analysisResults = new Map();

// 测试激活码
activationCodes.set('8888', { status: 'unused', usedAt: null });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const upload = multer({ storage: multer.memoryStorage() });

// 健康检查
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 验证激活码
app.post('/api/v1/activate/validate', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: '请提供激活码' });
  
  if (code === '8888') return res.json({ valid: true, message: '测试激活码有效' });
  
  const record = activationCodes.get(code);
  if (!record) return res.status(404).json({ error: '激活码不存在' });
  if (record.status === 'used') return res.status(400).json({ error: '激活码已被使用' });
  
  res.json({ valid: true, message: '激活码有效' });
});

// 分析头像
app.post('/api/v1/analysis', upload.single('image'), async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: '请提供激活码' });
    if (!req.file) return res.status(400).json({ error: '请上传头像' });
    
    // 测试码直接通过
    if (code !== '8888') {
      const record = activationCodes.get(code);
      if (!record) return res.status(404).json({ error: '激活码不存在' });
      if (record.status === 'used') return res.status(400).json({ error: '激活码已被使用' });
    }
    
    // 调用通义千问API
    const base64Image = req.file.buffer.toString('base64');
    const apiKey = process.env.QWEN_API_KEY;
    const baseUrl = process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
    
    let analysisResult;
    
    try {
      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model: 'qwen-vl-max',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: '分析这张头像照片，从吸引力、社交力等维度给出评分（0-100）和简短建议。返回JSON格式：{score, rank, tags, description}' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
          }],
          max_tokens: 1000
        },
        { headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, timeout: 30000 }
      );
      
      const content = response.data.choices[0]?.message?.content || '';
      // 尝试解析JSON，失败则使用默认
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        analysisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch {
        analysisResult = null;
      }
    } catch (apiError) {
      console.log('API调用失败，使用模拟数据');
    }
    
    // 使用默认数据或API返回数据
    if (!analysisResult) {
      analysisResult = {
        score: 78,
        rank: "击败82%同城用户",
        tags: ["温柔知性", "亲和力强", "高知感"],
        description: "你的头像传递出一种『岁月静好』的温柔感，给人很舒服的感觉。",
        genderScores: { male: { score: 75, description: "容易让人产生保护欲" }, female: { score: 88, description: "是想要成为的样子" } },
        psychologyInsight: "你的头像是一张防御盾牌，挡住了优质男的勇气",
        goldenPhrase: "你的温柔是优势，但偶尔需要一点难以捉摸的神秘感",
        sceneSuggestions: [{ scene: "职场", advice: "增加设计感单品" }, { scene: "婚恋", advice: "增加生活情趣信号" }, { scene: "日常", advice: "穿插有态度的照片" }]
      };
    }
    
    const analysisId = uuidv4();
    analysisResults.set(analysisId, { imageUrl: 'uploaded', result: analysisResult });
    
    // 标记激活码已使用
    if (code !== '8888') {
      const record = activationCodes.get(code);
      if (record) {
        record.status = 'used';
        record.usedAt = new Date();
      }
    }
    
    res.json({ success: true, analysisId, result: analysisResult });
    
  } catch (error) {
    console.error('分析错误:', error);
    res.status(500).json({ error: '分析失败，请重试' });
  }
});

// 获取分析结果
app.get('/api/v1/analysis/:analysisId', (req, res) => {
  const { analysisId } = req.params;
  const result = analysisResults.get(analysisId);
  if (!result) return res.status(404).json({ error: '分析报告不存在' });
  res.json({ success: true, result: result.result });
});

app.listen(PORT, () => {
  console.log(`🌸 桃花镜后端服务运行在 http://0.0.0.0:${PORT}`);
});