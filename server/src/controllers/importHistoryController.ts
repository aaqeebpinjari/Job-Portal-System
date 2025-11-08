import { Request, Response } from 'express';
import { ImportLogModel } from '../models/ImportLog';

export const getImportHistory = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, Number.parseInt((req.query.page as string) ?? '1', 10));
  const limit = Math.max(1, Math.min(100, Number.parseInt((req.query.limit as string) ?? '10', 10)));
  const sourceUrl = (req.query.sourceUrl as string)?.trim();

  const filter = sourceUrl ? { sourceUrl } : {};

  try {
    const [total, data] = await Promise.all([
      ImportLogModel.countDocuments(filter),
      ImportLogModel.find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
    ]);

    res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve import history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

