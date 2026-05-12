const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
const connect = require("connect");
const { simMiddleware } = require("serve-sim/middleware");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && ['@expo/ui/swift-ui', '@expo/ui/swift-ui/modifiers'].includes(moduleName)) {
     return {
      type: 'empty',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
} 

config.server = config.server || {};
const originalEnhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (metroMiddleware, server) => {
  const middleware = originalEnhanceMiddleware
    ? originalEnhanceMiddleware(metroMiddleware, server)
    : metroMiddleware;
  const app = connect();
  app.use(simMiddleware({ basePath: "/.sim" }));
  app.use(middleware);
  return app;
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css",
  debug: true,
});
