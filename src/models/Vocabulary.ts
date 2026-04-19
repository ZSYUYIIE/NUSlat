import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVocabulary extends Document {
  lessonId: string;
  moduleId: string;
  chapterId: string;
  chapterTitle: string;
  chapterOrder: number;
  wordOrder: number;
  thaiWord: string;
  phonetic: string;
  englishTranslation: string;
  options: string[];
  correctOption?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VocabularySchema: Schema<IVocabulary> = new Schema(
  {
    lessonId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    moduleId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    chapterId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    chapterTitle: {
      type: String,
      required: true,
      trim: true,
    },
    chapterOrder: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },
    wordOrder: {
      type: Number,
      required: true,
      min: 1,
    },
    thaiWord: {
      type: String,
      required: true,
      trim: true,
    },
    phonetic: {
      type: String,
      required: true,
      trim: true,
    },
    englishTranslation: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      default: [],
    },
    correctOption: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

VocabularySchema.index({ moduleId: 1, chapterOrder: 1, wordOrder: 1 });
VocabularySchema.index({ chapterId: 1, wordOrder: 1 }, { unique: true });

const Vocabulary: Model<IVocabulary> =
  (mongoose.models.Vocabulary as Model<IVocabulary>) ||
  mongoose.model<IVocabulary>("Vocabulary", VocabularySchema);

export default Vocabulary;