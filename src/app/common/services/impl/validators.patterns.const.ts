/**
 * 格式验证正则
 */
export class ValidatorsPatterns{
  /**
   * 数字
   * @type {RegExp}
   */
  static NUMBER = /^\d+/;

  /**
   * 手机号
   * @type {RegExp}
   */
  static PHONE = /^1\d{10}/g;

  /**
   * 座机
   * @type {RegExp}
   */
  static LANDLINE = /^(\d{3,4})?(-)?(\d{7,8})/;
}
