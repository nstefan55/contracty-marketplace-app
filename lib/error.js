import { CredentialsSignin } from "next-auth";

export class RateLimitError extends CredentialsSignin {
  constructor(retryAfterMinutes) {
    super();
    this.code = `Too many attempts. Please try again in ${retryAfterMinutes} minute(s).`;
  }
}
