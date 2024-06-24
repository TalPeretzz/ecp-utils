export type AuditLogMessage = {
  action: 'create' | 'read' | 'update' | 'delete';
  outcome: 'success' | 'failure';
  resource: {
    id: string;
    name: string;
  };
  initiator: {
    type: 'user' | 'system';
    id: string;
  };
  details: {
    message: string;
    additionalData?: Record<string, any>;
  };
};
