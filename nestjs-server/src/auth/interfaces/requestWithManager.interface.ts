import { Request } from 'express';
import { Managers } from '@prisma/client';

interface RequestWithManager extends Request {
  user: Managers;
}

export default RequestWithManager;