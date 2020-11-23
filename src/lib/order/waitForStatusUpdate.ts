import axios from 'axios';
import * as _ from 'lodash';

import { asyncSleep } from 'src/lib/asyncSleep';
import { logger } from 'src/lib/logger/_index';
import { ONE_MINUTE_IN_MS } from 'src/lib/const';

export async function waitForStatusUpdate(orderId: string) {
  let attempt = 0;
  while (true) {
    logger.log(`Wait for status update for ${orderId}, attempt: ${attempt}`);

    const orderState = await getOrderState(orderId, attempt);

    if (
      _.get(orderState, 'data.State') === process.env.PARTNER_ORDER_FINISHED
    ) {
      return orderState;
    }

    if (attempt > _.toNumber(process.env.MAX_API_RETRY)) {
      logger.error(`Max retry on status update occurred for ${orderId}`);
      throw new Error('Max retry occurred');
    }

    await asyncSleep(ONE_MINUTE_IN_MS);
    attempt++;
  }
}

const getOrderState = async (orderId: string, attempt: number) => {
  try {
    return await axios.get(
      `${process.env.PARTNER_API}/api/orders/${orderId}/state`,
      {
        auth: {
          username: process.env.PARTNER_USERNAME,
          password: process.env.PARTNER_PASSWORD,
        },
      },
    );
  } catch (e) {
    logger.error(e.message);
    if (
      _.get(e, 'response.status') < 500 ||
      attempt < _.toNumber(process.env.MAX_API_RETRY)
    ) {
      throw e;
    }
    return {};
  }
};
