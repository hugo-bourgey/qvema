import { Injectable } from '@nestjs/common';

@Injectable()
export class BlackListService {
  constructor() {}

  private blacklist: string[] = [];

  addToken(token: string) {
    this.blacklist.push(token);
  }

  isBlacklisted(token: string) {
    return this.blacklist.includes(token);
  }
}
