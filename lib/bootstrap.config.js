'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userConfigFileExists = undefined;
exports.createConfig = createConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fileExists = require('./utils/fileExists');

var _fileExists2 = _interopRequireDefault(_fileExists);

var _resolveDefaultConfigPath = require('./utils/resolveDefaultConfigPath');

var _resolveDefaultConfigPath2 = _interopRequireDefault(_resolveDefaultConfigPath);

var _parseConfig = require('./utils/parseConfig');

var _parseConfig2 = _interopRequireDefault(_parseConfig);

var _selectModules = require('./utils/selectModules');

var _selectModules2 = _interopRequireDefault(_selectModules);

var _selectUserModules = require('./utils/selectUserModules');

var _selectUserModules2 = _interopRequireDefault(_selectUserModules);

var _getEnvProp = require('./utils/getEnvProp');

var _getEnvProp2 = _interopRequireDefault(_getEnvProp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ======= Fetching config */

var DEFAULT_VERSION = 3;
var SUPPORTED_VERSIONS = [3, 4];
var CONFIG_FILE = '.bootstraprc';
var defaultUserConfigPath = '../../../' + CONFIG_FILE;

var rawConfig = void 0;
var defaultConfig = void 0;

function userConfigFileExists(userConfigPath) {
  return (0, _fileExists2.default)(userConfigPath);
}

function setConfigVariables(configFilePath) {
  if (configFilePath) {
    rawConfig = (0, _parseConfig2.default)(configFilePath);

    var _rawConfig = rawConfig;
    var bootstrapVersion = _rawConfig.bootstrapVersion;


    if (!bootstrapVersion) {
      throw new Error('\n        I can\'t find Bootstrap version in your \'.bootstraprc\'.\n        Make sure it\'s set to 3 or 4. Like this:\n          bootstrapVersion: 4\n      ');
    }

    if (SUPPORTED_VERSIONS.indexOf(parseInt(bootstrapVersion, 10)) === -1) {
      throw new Error('\n        Looks like you have unsupported Bootstrap version in your \'.bootstraprc\'.\n        Make sure it\'s set to 3 or 4. Like this:\n          bootstrapVersion: 4\n      ');
    }

    var defaultConfigPath = (0, _resolveDefaultConfigPath2.default)(CONFIG_FILE, bootstrapVersion);
    defaultConfig = (0, _parseConfig2.default)(defaultConfigPath);
  } else {
    var _defaultConfigPath = (0, _resolveDefaultConfigPath2.default)(CONFIG_FILE, DEFAULT_VERSION);
    rawConfig = defaultConfig = (0, _parseConfig2.default)(_defaultConfigPath);
  }
}

/* ======= Exports */
exports.userConfigFileExists = userConfigFileExists;
function createConfig(_ref) {
  var extractStyles = _ref.extractStyles;
  var _ref$configFilePath = _ref.configFilePath;
  var configFilePath = _ref$configFilePath === undefined ? defaultUserConfigPath : _ref$configFilePath;

  var configFile = _path2.default.resolve(__dirname, configFilePath);

  if (userConfigFileExists(configFile)) {
    setConfigVariables(configFile);
    var configDir = _path2.default.dirname(configFile);
    var preBootstrapCustomizations = rawConfig.preBootstrapCustomizations && _path2.default.resolve(configDir, rawConfig.preBootstrapCustomizations);
    var bootstrapCustomizations = rawConfig.bootstrapCustomizations && _path2.default.resolve(configDir, rawConfig.bootstrapCustomizations);
    var appStyles = rawConfig.appStyles && _path2.default.resolve(configDir, rawConfig.appStyles);

    return {
      bootstrapVersion: parseInt(rawConfig.bootstrapVersion, 10),
      loglevel: rawConfig.loglevel,
      preBootstrapCustomizations: preBootstrapCustomizations,
      bootstrapCustomizations: bootstrapCustomizations,
      appStyles: appStyles,
      useFlexbox: rawConfig.useFlexbox,
      useCustomIconFontPath: rawConfig.useCustomIconFontPath,
      extractStyles: extractStyles || (0, _getEnvProp2.default)('extractStyles', rawConfig),
      styleLoaders: rawConfig.styleLoaders,
      styles: (0, _selectUserModules2.default)(rawConfig.styles, defaultConfig.styles),
      scripts: (0, _selectUserModules2.default)(rawConfig.scripts, defaultConfig.scripts)
    };
  }

  return {
    bootstrapVersion: parseInt(rawConfig.bootstrapVersion, 10),
    loglevel: rawConfig.loglevel,
    useFlexbox: defaultConfig.useFlexbox,
    useCustomIconFontPath: defaultConfig.useCustomIconFontPath,
    extractStyles: extractStyles || (0, _getEnvProp2.default)('extractStyles', defaultConfig),
    styleLoaders: defaultConfig.styleLoaders,
    styles: (0, _selectModules2.default)(defaultConfig.styles),
    scripts: (0, _selectModules2.default)(defaultConfig.scripts)
  };
}