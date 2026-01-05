/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImageAnalysisDocument =
  HydratedDocument<ImageAnalysisSchemaClass>;

@Schema({
  timestamps: true,
  collection: 'imageanalyses',
})
export class ImageAnalysisSchemaClass {
  @Prop({ required: true })
  filename!: string;

  @Prop()
  bucket!: string;

  @Prop({ type: Object })
  metadata!: Record<string, any>;

  @Prop({ type: Array })
  palette!: { r: number; g: number; b: number }[];

  @Prop()
  brightness!: string;

  @Prop()
  hash!: string;
}

export const ImageAnalysisSchema = SchemaFactory.createForClass(ImageAnalysisSchemaClass);

