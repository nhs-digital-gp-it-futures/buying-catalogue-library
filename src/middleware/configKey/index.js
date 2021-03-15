export class ConfigHelper {
  static maskConfigKey(key) {
    const forbiddenKeys = [
      'cookieSecret',
      'redisPass',
    ];

    const keyLowerCase = key.toLocaleLowerCase();
    const result = forbiddenKeys.filter((word) => word.toLocaleLowerCase() === keyLowerCase);

    return result.length > 0;
  }

  static getConfigKeyValue(key, value) {
    const maskValue = '****';
    const found = this.maskConfigKey(key);

    return found ? maskValue : value;
  }
}
