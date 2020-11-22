import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(order: object): Promise<Order> {
    const createdOrder = new this.orderModel(order);

    return createdOrder.save();
  }
  async updateById(_id: string, data: object): Promise<Order> {
    return this.orderModel.updateOne({ _id }, { $set: data });
  }
  async findAll(data: object): Promise<Order[]> {
    return this.orderModel.find(data).exec();
  }
}
