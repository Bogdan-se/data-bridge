import {
  Controller,
  Req,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import * as _ from 'lodash';

import Formatter from 'src/lib/formatter/_index';
import { logger } from 'src/lib/logger/_index';
import { Partner } from 'src/db/schemas/partner.schema';
import { PartnerService } from 'src/db/partner.service';
import { Order, ORDER_STATE } from 'src/db/schemas/order.schema';
import { OrderService } from 'src/db/order.service';

import { notifyPartner } from 'src/lib/order/notifyPartner';
import { notifyProvider } from 'src/lib/order/notifyProvider';
import { waitForStatusUpdate } from 'src/lib/order/waitForStatusUpdate';
import { validate } from 'src/lib/formatter/validate';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly partnerService: PartnerService,
    private readonly formatter: Formatter,
  ) {
    this.resumeOrderProcessing();
  }

  @Post()
  async createOrder(@Req() req: Request): Promise<any> {
    const partner = await this.getPartner(req);
    const formatter = this.formatter.getProvider(partner.provider);

    try {
      const order = await formatter.normalizeOrder(req.body);
      await validate(order);

      const createdOrder = await this.orderService.create({
        partnerId: partner._id,
        data: order,
        originalData: req.body,
        isValid: true,
        state: ORDER_STATE.NEW,
      } as Order);

      this.processOrder(createdOrder, partner);
    } catch (e) {
      logger.error(`Invalid order ${JSON.stringify(_.toPlainObject(req.body))}, error:${e.message}`);
      await this.orderService.create({
        partnerId: partner._id,
        data: null,
        originalData: req.body,
        isValid: false,
        state: ORDER_STATE.INVALID,
      } as Order);
    }

    return req.body;
  }

  async getPartner(req: Request): Promise<Partner> {
    const partner = await this.partnerService.findByKey(
      req.headers['x-api-key'].toString(),
    );
    if (_.isNil(partner)) {
      throw new HttpException('Not authorised', HttpStatus.UNAUTHORIZED);
    }

    return partner;
  }

  async resumeOrderProcessing() {
    const orders = await this.orderService.findAll({ state: ORDER_STATE.NEW });
    const partnerIds = _(orders).map('partnerId').uniq().value();

    const partners = await this.partnerService.findAll({
      _id: { $in: partnerIds },
    });
    const formattedPartners = _.keyBy(partners, '_id');

    for (const order of orders) {
      await this.processOrder(order, formattedPartners[order.partnerId]);
    }
  }

  async processOrder(order: Order, partner: Partner) {
    try {
      logger.log(`Starting processing of order ${order._id}`);
      await notifyProvider(order.data);
      await waitForStatusUpdate(order.data.OrderID);
      await notifyPartner(order.data, partner);
      await this.orderService.updateById(order._id, {
        state: ORDER_STATE.PROCESSED,
      });
      logger.log(`Order ${order._id} successfully processed`);
    } catch (e) {
      logger.error(e);
      await this.orderService.updateById(order._id, {
        state: ORDER_STATE.FAILED,
      });
    }
  }
}
