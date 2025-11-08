import { Schema, model, Document } from 'mongoose';

export interface IFailedJob {
  jobId?: string;
  reason: string;
}

export interface IImportLog extends Document {
  sourceUrl: string;
  timestamp: Date;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: IFailedJob[];
}

const failedJobSchema = new Schema<IFailedJob>(
  {
    jobId: { type: String },
    reason: { type: String, required: true }
  },
  { _id: false }
);

const importLogSchema = new Schema<IImportLog>(
  {
    sourceUrl: { type: String, required: true },
    timestamp: { type: Date, default: () => new Date() },
    totalFetched: { type: Number, required: true },
    totalImported: { type: Number, required: true },
    newJobs: { type: Number, required: true },
    updatedJobs: { type: Number, required: true },
    failedJobs: { type: [failedJobSchema], default: [] }
  },
  {
    timestamps: false
  }
);

importLogSchema.index({ timestamp: -1 });

export const ImportLogModel = model<IImportLog>('ImportLog', importLogSchema);

