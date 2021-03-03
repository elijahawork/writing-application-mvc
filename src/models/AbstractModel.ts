import { writeFileSync } from 'fs';
import { join } from 'path';
import { __PROJ_NAME } from '..';
import SchemaField from '../decorators/SchemaField';
import ISchema from '../schema/IModelSchema';

const modelRegistry = new Map<number, AbstractModel<any>>();

abstract class AbstractModel<Schema extends ISchema> {
  private readonly model: Schema = {} as Schema;
  private readonly EXT: string;

  private get filePath() {
    return join(__PROJ_NAME, `${this.id}.${this.EXT}`);
  }

  @SchemaField
  id: number;
  /**
   *
   * @param ext Extension for file that serialized data to store in
   * @param obj The object that contains the data for the specified Schema
   */
  constructor(ext: string, obj: Schema) {
    this.EXT = ext;
    this.id = obj.id;
    modelRegistry.set(this.id, this);
  }

  protected updateFile() {
    writeFileSync(this.filePath, JSON.stringify(this.model));
  }
  public static generateUniqueID(): number {
    let id: number;
    do {
      id = Math.floor(Math.random() * modelRegistry.size);
    } while (modelRegistry.has(id));
    return id;
  }
}

export default AbstractModel;
