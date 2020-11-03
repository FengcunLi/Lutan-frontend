module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    devtool: 'source-map',
  },

  chainWebpack: config => {
    // remove the prefetch plugin
    config.plugins.delete('prefetch');
  },
};
