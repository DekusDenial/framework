/**
 * Copyright 2021, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */
import ColumnMetadataModel, { ColumnInstance, ColumnMetadata, ColumnMetadataPayload, ColumnType } from './column';
import { Cardinality } from '../../utils/enums/cardinality-sizes';

type Field = TODO;

// Shape of public properties on model
export interface DimensionMetadata extends ColumnMetadata {
  cardinality?: Cardinality;
  getTagsForField(fieldName: string): string[];
  getFieldsForTag(tag: string): Field[];
  primaryKeyFieldName: string;
  descriptionFieldName: string;
  idFieldName: string;
  extended: Promise<DimensionMetadataModel | undefined>;
}
// Shape passed to model constructor
export interface DimensionMetadataPayload extends ColumnMetadataPayload {
  fields?: Field[];
  cardinality?: Cardinality;
  storageStrategy?: TODO<'loaded' | 'none' | null>;
}

export type DimensionColumn = ColumnInstance<DimensionMetadataModel>;

export default class DimensionMetadataModel
  extends ColumnMetadataModel
  implements DimensionMetadata, DimensionMetadataPayload {
  /**
   * @static
   * @property {string} identifierField
   */
  static identifierField = 'id';

  metadataType: ColumnType = 'dimension';

  /**
   * @property {Object[]} fields - Array of field objects
   */
  fields?: Field[];

  /**
   * @property {string} primaryKeyTag - name of the primary key tag
   */
  private primaryKeyTag = 'primaryKey';

  /**
   * @property {string} descriptionTag - name of the description tag
   */
  private descriptionTag = 'description';

  /**
   * @property {string} idTag - name of the searchable id tag
   */
  private idTag = 'id';

  /**
   * @property {Cardinality|undefined} cardinality - the cardinality size of the dimension
   */
  cardinality?: Cardinality;

  /**
   * Fetches tags for a given field name
   *
   * @method getTagsForField
   * @param {string} fieldName - name of the field to query tags
   * @returns {Array} array of tags
   */
  getTagsForField(fieldName: string): string[] {
    const field = this.fields?.find((f) => f.name === fieldName);

    return field?.tags || [];
  }

  /**
   * Fetches fields for a given tag
   *
   * @method getFieldsForTag
   * @param {string} tag - name of tag
   * @returns {Array} array of field objects
   */
  getFieldsForTag(tag: string): Field[] {
    return (
      this.fields?.filter((field) => {
        return field.tags?.includes(tag);
      }) || []
    );
  }

  /**
   * @property {string} primaryKeyFieldName
   */
  get primaryKeyFieldName(): string {
    const { primaryKeyTag: tag } = this;
    const field = this.getFieldsForTag(tag)?.[0];
    return field?.name || 'id';
  }

  /**
   * @property {string} descriptionFieldName
   */
  get descriptionFieldName(): string {
    const { descriptionTag: tag } = this;
    const field = this.getFieldsForTag(tag)?.[0];
    return field?.name || 'desc';
  }

  /**
   * @property {string} idFieldName
   */
  get idFieldName(): string {
    const { idTag: tag } = this;
    const field = this.getFieldsForTag(tag)?.[0];
    return field?.name || this.primaryKeyFieldName;
  }

  storageStrategy?: TODO<'loaded' | 'none' | null>;

  /**
   * @property {Promise} extended - extended metadata for the dimension that isn't provided in initial table fullView metadata load
   */
  get extended(): Promise<DimensionMetadataModel> {
    const { naviMetadata, id, source } = this;
    return naviMetadata.findById('dimension', id, source).then((d) => d || this);
  }
}

declare module './registry' {
  export default interface MetadataModelRegistry {
    dimension: DimensionMetadataModel;
  }
}
