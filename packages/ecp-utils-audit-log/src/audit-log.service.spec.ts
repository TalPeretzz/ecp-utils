import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { AuditLogService } from './audit-log.service';
import { AuditLogMessage } from './audit-log.types';

describe('AuditLogService', () => {
  let service: AuditLogService;
  const loggerMock = mock<Logger>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditLogService],
    }).compile();

    module.useLogger(loggerMock);
    service = module.get<AuditLogService>(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should call logger.log with the provided message', () => {
      const auditLogMessage: AuditLogMessage = {
        action: 'create',
        initiator: {
          id: 'user-id',
          type: 'user',
        },
        outcome: 'success',
        resource: {
          id: 'example-id',
          name: 'example',
        },
        details: 'Example created successfully',
      };
      service.log(auditLogMessage);

      expect(loggerMock.log).toHaveBeenCalledWith({ auditLogMessage }, AuditLogService.name);
    });
  });
});

describe('AuditLogService', () => {
  let service: AuditLogService;
  const loggerMock = mock<Logger>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditLogService],
    }).compile();

    module.useLogger(loggerMock);
    service = module.get<AuditLogService>(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should call logger.log with the provided message', () => {
      const auditLogMessage: AuditLogMessage = {
        action: 'create',
        initiator: {
          id: 'user-id',
          type: 'user',
        },
        outcome: 'success',
        resource: {
          id: 'example-id',
          name: 'example',
        },
        details: 'Example created successfully',
      };
      service.log(auditLogMessage);

      expect(loggerMock.log).toHaveBeenCalledWith({ auditLogMessage }, AuditLogService.name);
    });
  });
});
