export default class stcAdapter {
  constructor(options, config) {
    this.blockStart = options.blockStart || config.tpl.ld[0];
    this.blockEnd = options.blockStart || config.tpl.rd[0];

    this.options = options;
    this.config = config;
  }

  getLsSupportCode() {
    let { blockStart, blockEnd } = this;

    let nlsCookie = this.options.nlsCookie;

    let data = {};

    data['if'] = `${blockStart} if(isset($_SERVER["HTTP_USER_AGENT"]) && strpos($_SERVER["HTTP_USER_AGENT"], "MSIE ") === false && !isset($_COOKIE["${nlsCookie}"])) { ${blockEnd}`;
    data['else'] = `${blockStart} } else { ${blockEnd}`;
    data['end'] = `${blockStart} } ${blockEnd}`;

    return data;
  }

  getLsConfigCode(appConfig) {
    let { blockStart, blockEnd } = this;
    
    let configStr = JSON.stringify(appConfig);

    return `${blockStart} $stc_ls_config = json_decode(\'${configStr}\', true); ${blockEnd}`;
  }

  getLsBaseCode() {
    let { blockStart, blockEnd } = this;

    let name = 'stc_ls_base_flag';

    let data = {};

    data['if'] = `${blockStart} if(!isset($${name})) { $${name} = true; ${blockEnd}`;
    data['end'] = `${blockStart} } ${blockEnd}`;

    return data;
  }

  getLsParseCookieCode() {
    let { blockStart, blockEnd } = this;

    let lsCookie = this.options.lsCookie;

    let content = [
      `${blockStart} if(isset($_COOKIE["${lsCookie}"])) {`,
      `$stc_ls_cookie = $_COOKIE["${lsCookie}"];`,
      `} else {`,
      `$stc_ls_cookie = "";`,
      `}`,
      `$stc_cookie_length = strlen($stc_ls_cookie,`,
      `$stc_ls_cookies = array(,`,
      `for($i = 0; $i < $stc_cookie_length;$i += 2) {`,
      `$stc_ls_cookies[$stc_ls_cookie[$i]] = $stc_ls_cookie[$i+1];`,
      `} ${blockEnd}`,
    ];

    return content.join('');
  }

  getLsConditionCode(lsValue) {
    let { blockStart, blockEnd } = this;

    let data = {};

    data['if'] = `${blockStart} if(isset($stc_ls_config["${lsValue}"]) && isset($stc_ls_cookies[$stc_ls_config["${lsValue}"]["key"]]) && $stc_ls_config["${lsValue}"]["version"] === $stc_ls_cookies[$stc_ls_config["${lsValue}"]["key"]]) { ${blockEnd}`;
    data['else'] = `${blockStart} } else { ${blockEnd}`;
    data['end'] = `${blockStart} } ${blockEnd}`;
    data['key'] = `${blockStart} echo $stc_ls_config["${lsValue}"]["key"]; ${blockEnd}`;
    data['version'] = `${blockStart} echo $stc_ls_config["${lsValue}"]["version"]; ${blockEnd}`;

    return data;
  }
};