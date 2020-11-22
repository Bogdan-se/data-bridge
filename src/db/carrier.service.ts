import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Carrier } from './schemas/carrier.schema';

@Injectable()
export class CarrierService {
  constructor(
    @InjectModel(Carrier.name) private carrierModel: Model<Carrier>,
  ) {}

  async updateCarrierList(carriers: Carrier[]): Promise<Carrier[]> {
    await this.carrierModel.remove({});
    return this.carrierModel.insertMany(carriers);
  }

  async findByName(name: string): Promise<Carrier> {
    return this.carrierModel.findOne({ name }).exec();
  }
}
