/**
 * 公用枚举与常量
 */
export class CommonEnumConst{
  /**
   * 初始化数据缓存key
   */
  public static INIT_DATA_SESSION_STORAGE_KEY = {
    SYSTEM_CFG:'system_config',
    DOMAIN_CFG:'domain_config',
    FUNCS:'funcs',
    TREES:'trees'
  };

  /**
   * 缓存key
   * @type {{USER_INFO: string}}
   */
  public static AUTH_SESSION_STORAGE_KEY = {
    USER_INFO:'user_info'
  };

  /**
   * 查询条件缓存KEY
   * @type string
   */
  public static QUERY_PARAMS_STORAGE_KEY = 'query_params';

}
