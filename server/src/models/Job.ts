import { Schema, model, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: string;
  url: string;
  raw: Record<string, unknown>;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    raw: { type: Schema.Types.Mixed, required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

jobSchema.index({ url: 1 }, { unique: true });

export const JobModel = model<IJob>('Job', jobSchema);

