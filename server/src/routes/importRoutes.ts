import { Router } from 'express';
import { triggerImport } from '../controllers/importController';
import { getImportHistory } from '../controllers/importHistoryController';

const router = Router();

router.get('/import', triggerImport);
router.get('/import-history', getImportHistory);

export default router;
