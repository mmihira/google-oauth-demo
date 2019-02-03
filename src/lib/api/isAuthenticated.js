import * as API from 'lib/api/extensions';
import ApiError from 'lib/api/apiError';

/**
 * Get authentication info
 */
const isAuthenticated = () =>
  fetch(API.IS_AUTHENTICATED(), {
    method: 'get',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  })
    .then(res => {
      if (res.ok) return res.json();
      throw new ApiError({ msg: res.statusText, res });
    })
    .then(res => ({
      response: res
    }))
    .catch(error => {
      switch (error.res.status) {
        default:
          return { error: 'A server error occured' };
      }
    });

export { isAuthenticated };
