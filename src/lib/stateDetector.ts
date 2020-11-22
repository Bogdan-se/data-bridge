import axios from 'axios';
import * as _ from 'lodash';

export async function stateDetector(code: string, country: string) {
  return axios
    .get('https://app.zipcodebase.com/api/v1/search', {
      params: {
        apikey: process.env.ZIPCODEBASE_API_KEY,
        codes: code,
        country: country,
      },
    })
    .then((response) => {
      return _.get(_.head(response.data.results[code]), 'state');
    });
}
