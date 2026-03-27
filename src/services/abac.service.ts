// services/abac.service.ts
export class ABACService {
  evaluate(conditions: any, context: any): boolean {
    if (!conditions) return true;

    return Object.entries(conditions).every(([key, value]) => {
      const keys = key.split(".");
      let ctxVal = context;

      for (const k of keys) {
        ctxVal = ctxVal?.[k];
      }

      return ctxVal === value;
    });
  }
}