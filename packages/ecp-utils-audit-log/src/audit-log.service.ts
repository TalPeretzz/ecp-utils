import { Injectable, Logger } from '@nestjs/common';
import { AuditLogMessage } from './audit-log.types';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  log(auditLogMessage: AuditLogMessage) {
    this.logger.log({ auditLogMessage });
  }
}
