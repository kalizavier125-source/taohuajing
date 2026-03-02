import mongoose, { Schema, Document } from 'mongoose'

export interface IAnalysisResult extends Document {
  analysisId: string
  imageUrl: string
  result: {
    score: number
    rank: string
    tags: string[]
    genderScores: {
      male: { score: number; description: string }
      female: { score: number; description: string }
    }
    firstImpression: string
    visualComfort: { score: number; description: string }
    affinityScore: { score: number; description: string }
    trustScore: { score: number; description: string }
    psychologyInsight: string
    goldenPhrase: string
    redFlags: string[]
    sceneSuggestions: Array<{ scene: string; advice: string }>
    styleRecommend: string
    colorPsychology: string
    compositionPsychology: string
    microExpression: string
    energyType: string
    bestMatch: string
  }
  createdAt: Date
}

const AnalysisResultSchema: Schema = new Schema({
  analysisId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  result: {
    score: Number,
    rank: String,
    tags: [String],
    genderScores: {
      male: {
        score: Number,
        description: String
      },
      female: {
        score: Number,
        description: String
      }
    },
    firstImpression: String,
    visualComfort: {
      score: Number,
      description: String
    },
    affinityScore: {
      score: Number,
      description: String
    },
    trustScore: {
      score: Number,
      description: String
    },
    psychologyInsight: String,
    goldenPhrase: String,
    redFlags: [String],
    sceneSuggestions: [{
      scene: String,
      advice: String
    }],
    styleRecommend: String,
    colorPsychology: String,
    compositionPsychology: String,
    microExpression: String,
    energyType: String,
    bestMatch: String
  }
}, {
  timestamps: true
})

export const AnalysisResult = mongoose.model<IAnalysisResult>('AnalysisResult', AnalysisResultSchema)