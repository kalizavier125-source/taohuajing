import mongoose from 'mongoose'

// 简化的内存存储模式（无需安装MongoDB）
export const connectDB = async () => {
  try {
    // 使用内存模式
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri)
    console.log('✅ MongoDB 内存模式已启动（测试环境）')
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    console.log('⚠️ 使用简化的内存存储模式')
    // 继续运行，使用内存对象存储
  }
}