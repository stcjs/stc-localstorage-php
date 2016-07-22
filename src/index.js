export default class stcAdapter {
  constructor(options, config) {
    this.options = options;
    this.config = config;
  }

  getLsSupportCode() {
    let { ld, rd } = this.config.tpl;
    let nlsCookie = this.options.nlsCookie;

    let data = {};

    data['if'] = `${ld} if(isset($_SERVER["HTTP_USER_AGENT"]) && strpos($_SERVER["HTTP_USER_AGENT"], "MSIE ") === false && !isset($_COOKIE["${nlsCookie}"])) { ${rd}`;
    data['else'] = `${ld} } else { ${rd}`;
    data['end'] = `${ld} } ${rd}`;

    return data;
  }

  getLsConfigCode(appConfig) {
    let { ld, rd } = this.config.tpl;
    
    let configStr = JSON.stringify(appConfig);

    return `${ld} $stc_ls_config = json_decode(\'${configStr}\', true); ${rd}`;
  }

  getLsBaseCode() {
    let { ld, rd } = this.config.tpl;
    let name = 'stc_ls_base_flag';

    let data = {};

    data['if'] = `${ld} if(!isset($${name})) { $${name} = true; ${rd}`;
    data['end'] = `${ld} } ${rd}`;

    return data;
  }

  getLsParseCookieCode() {
    let { ld, rd } = this.config.tpl;
    let lsCookie = this.options.lsCookie;

    let content = [
      ld,
      `if(isset($_COOKIE["${lsCookie}"])) {`,
      `$stc_ls_cookie = $_COOKIE["${lsCookie}"];`,
      `} else {`,
      `$stc_ls_cookie = "";`,
      `}`,
      `$stc_cookie_length = strlen($stc_ls_cookie,`,
      `$stc_ls_cookies = array(,`,
      `for($i = 0; $i < $stc_cookie_length;$i += 2) {`,
      `$stc_ls_cookies[$stc_ls_cookie[$i]] = $stc_ls_cookie[$i+1];`,
      `}`,
      rd,
    ];

    return content.join('');
  }

  getLsConditionCode(lsValue) {
    let { ld, rd } = this.config.tpl;

    let data = {};

    data['if'] = `${ld} if(isset($stc_ls_config["${lsValue}"]) && isset($stc_ls_cookies[$stc_ls_config["${lsValue}"]["key"]]) && $stc_ls_config["${lsValue}"]["version"] === $stc_ls_cookies[$stc_ls_config["${lsValue}"]["key"]]) { ${rd}`;
    data['else'] = `${ld} } else { ${rd}`;
    data['end'] = `${ld} } ${rd}`;
    data['key'] = `${ld} echo $stc_ls_config["${lsValue}"]["key"]; ${rd}`;
    data['version'] = `${ld} echo $stc_ls_config["${lsValue}"]["version"]; ${rd}`;

    return data;
  }
};