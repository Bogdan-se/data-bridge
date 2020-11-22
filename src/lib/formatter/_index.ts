import { Module } from '@nestjs/common';

import { CarrierService } from 'src/db/carrier.service';
import { dbImports } from 'src/db/_index';
import { OPT } from './OPT';

@Module({
  imports: [...dbImports],
  providers: [CarrierService],
})
export default class FormatterFactory {
  constructor(private readonly carrierService: CarrierService) {}

  getProvider(provider: string) {
    if (provider === 'OPT') {
      return new OPT(this.carrierService);
    }

    throw new Error(`Formatter for ${provider} not implemented`);
  }
}
