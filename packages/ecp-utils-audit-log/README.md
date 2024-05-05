# ecp-utils-audit-log
This package provides a simple way to log audit events in a structured way.
The package is built on top of NestJS and uses the NestJS Logger to log the events.

## Installation
```shell
npm i @elementor/ecp-utils-audit-log
```

## Usage
```typescript
import { AuditLogService } from '@elementor/ecp-utils-audit-log';

@Injectable()
export class CatsService {
  constructor(private readonly auditLogService: AuditLogService) {}

  async create(cat: Cat): Promise<Cat> {
    await this.catsRepository.create(cat);

    this.auditLogService.log({
        action: 'create',
        outcome: 'success',
        resource: {
            id: cat.id,
            name: cat.name,
        },
        initiator: {
            type: 'user',
            id: 'user-id',
        },
        details: {
            description: 'A new cat was created',
        },
    });

    return cat;
  }
}
```