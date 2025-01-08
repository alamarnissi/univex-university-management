import { Managers } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ManagerResponseDto implements Partial<Managers> {
  manager_id: string;
  email: string;
  first_name: string;
  role: string

  @Exclude()
  password: string;
}