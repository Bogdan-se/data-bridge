import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Partner } from './schemas/partner.schema';

@Injectable()
export class PartnerService {
  constructor(
    @InjectModel(Partner.name) private partnerModel: Model<Partner>,
  ) {}

  async findByKey(inboundApiKey: string): Promise<Partner> {
    return await this.partnerModel.findOne({ inboundApiKey }).exec();
  }
  async findAll(data: unknown): Promise<Partner[]> {
    return await this.partnerModel.find(data).exec();
  }

  async create(data: Partner): Promise<Partner> {
    const createdPartner = new this.partnerModel(data);

    return createdPartner.save();
  }
  async delete(_id: string): Promise<Partner> {
    return this.partnerModel.findByIdAndDelete(_id);
  }
}
