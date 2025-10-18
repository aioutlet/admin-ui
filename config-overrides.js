/**
 * Configuration overrides for Create React App
 * Used to fix webpack-dev-server deprecation warnings
 */

module.exports = {
  webpack: function (config, env) {
    return config;
  },

  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      // Create the default config by calling the function
      const config = configFunction(proxy, allowedHost);

      // Store the existing middleware functions if they exist
      const onBeforeSetupMiddleware = config.onBeforeSetupMiddleware;
      const onAfterSetupMiddleware = config.onAfterSetupMiddleware;

      // Remove deprecated options
      delete config.onBeforeSetupMiddleware;
      delete config.onAfterSetupMiddleware;

      // Use the new setupMiddlewares option
      config.setupMiddlewares = (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        // Call the old onBeforeSetupMiddleware if it existed
        if (onBeforeSetupMiddleware) {
          onBeforeSetupMiddleware(devServer);
        }

        // The middlewares array is already populated, just return it
        // You can add custom middlewares here if needed

        // Call the old onAfterSetupMiddleware if it existed
        if (onAfterSetupMiddleware) {
          onAfterSetupMiddleware(devServer);
        }

        return middlewares;
      };

      return config;
    };
  },
};
