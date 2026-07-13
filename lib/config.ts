import { getServerEnv } from '@/shared/env/server';

class Config {
  get NEXT_PUBLIC_SANITY_PROJECT_ID() {
    return getServerEnv().NEXT_PUBLIC_SANITY_PROJECT_ID;
  }

  get NEXT_PUBLIC_SANITY_DATASET() {
    return getServerEnv().NEXT_PUBLIC_SANITY_DATASET;
  }

  get SANITY_API_TOKEN() {
    return getServerEnv().SANITY_API_TOKEN;
  }

  get BUTTONDOWN_API_KEY() {
    return getServerEnv().BUTTONDOWN_API_KEY;
  }

  get INTERNAL_API_KEY() {
    return getServerEnv().INTERNAL_API_KEY;
  }

  get SENTRY_DSN() {
    return getServerEnv().SENTRY_DSN;
  }

  get NODE_ENV() {
    return getServerEnv().NODE_ENV;
  }
}

export const config = new Config();
