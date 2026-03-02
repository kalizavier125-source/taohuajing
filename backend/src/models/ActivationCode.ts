import mongoose, { Schema, Document } from 'mongoose'

export interface IActivationCode extends Document {
  code: string
  status: 'unused' | 'used' | 'expired'
  orderId?: string
  usedAt?: Date
  createdAt: Date
  analysisId?: string
}

const ActivationCodeSchema: Schema = new Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  status: { 
    type: String, 
    enum: ['unused', 'used', 'expired'], 
    default: 'unused' 
  },
  orderId: { 
    type: String,
    sparse: true 
  },
  usedAt: { 
    type: Date 
  },
  analysisId: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true
})

export const ActivationCode = mongoose.model<IActivationCode>('ActivationCode', ActivationCodeSchema)