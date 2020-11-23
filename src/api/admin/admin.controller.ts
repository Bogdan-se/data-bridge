import { Controller, Req, Param, Get, Post, Delete } from '@nestjs/common';
import { Request } from 'express';

import { Carrier } from 'src/db/schemas/carrier.schema';
import { CarrierService } from 'src/db/carrier.service';
import { Partner } from 'src/db/schemas/partner.schema';
import { PartnerService } from 'src/db/partner.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly carrierService: CarrierService,
    private readonly partnerService: PartnerService,
  ) {}

  @Post('update-carrier-list')
  async updateCarrierList(@Req() req: Request): Promise<Carrier[]> {
    return this.carrierService.updateCarrierList(req.body);
  }

  @Get('partner')
  async listPartners(): Promise<Partner[]> {
    return this.partnerService.findAll({});
  }

  @Post('partner')
  async createPartner(@Req() req: Request): Promise<Partner> {
    return this.partnerService.create(req.body);
  }

  @Delete('partner/:_id')
  async deletePartner(@Param('_id') _id: string): Promise<Partner> {
    return this.partnerService.delete(_id);
  }
}
