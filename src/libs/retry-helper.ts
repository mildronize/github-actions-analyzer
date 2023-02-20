// Ref: https://github.com/actions/checkout/blob/ac593985615ec2ede58e132d2e21d2b1cbd6127c/src/retry-helper.ts

import { logger } from './logger';

const defaultMaxAttempts = 3
const defaultMinSeconds = 10
const defaultMaxSeconds = 20

export class RetryHelper {
  private maxAttempts: number
  private minSeconds: number
  private maxSeconds: number

  constructor(
    maxAttempts: number = defaultMaxAttempts,
    minSeconds: number = defaultMinSeconds,
    maxSeconds: number = defaultMaxSeconds
  ) {
    this.maxAttempts = maxAttempts
    this.minSeconds = Math.floor(minSeconds)
    this.maxSeconds = Math.floor(maxSeconds)
    if (this.minSeconds > this.maxSeconds) {
      throw new Error('min seconds should be less than or equal to max seconds')
    }
  }

  async execute<T>(action: () => Promise<T>): Promise<T> {
    let attempt = 1
    while (attempt < this.maxAttempts) {
      // Try
      try {
        return await action()
      } catch (err) {
        logger.info((err as any)?.message)
      }

      // Sleep
      const seconds = this.getSleepAmount()
      logger.info(`Waiting ${seconds} seconds before trying again`)
      await this.sleep(seconds)
      attempt++
    }

    // Last attempt
    return await action()
  }

  private getSleepAmount(): number {
    return (
      Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) +
      this.minSeconds
    )
  }

  private async sleep(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
  }
}

export async function execute<T>(action: () => Promise<T>): Promise<T> {
  const retryHelper = new RetryHelper()
  return await retryHelper.execute(action)
}
