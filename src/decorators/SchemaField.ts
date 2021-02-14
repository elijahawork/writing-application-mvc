import ISchema from '../schema/IModelSchema';

function SchemaField<T extends ISchema>(details: T, fieldName: keyof T) {
  Object.defineProperty(details.constructor.prototype, fieldName, {
    get() {
      return this.model[fieldName];
    },
    set(v) {
      this.model[fieldName] = v;
      this.updateFile();
    },
  });
}

export default SchemaField;
