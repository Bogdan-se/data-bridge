import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(order: Order): Promise<Order> {
    const createdOrder = new this.orderModel(order);

    return createdOrder.save();
  }
  async updateById(_id: string, data: unknown): Promise<Order> {
    return this.orderModel.updateOne({ _id }, { $set: data });
  }
  async findAll(data: unknown): Promise<Order[]> {
    return this.orderModel.find(data).exec();
  }
}
