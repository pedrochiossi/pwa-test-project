const {
    configureWebpack,
    graphQL: { getMediaURL, getUnionAndInterfaceTypes }
} = require('@magento/pwa-buildpack');
const { DefinePlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webjumpOverrideMappingPlugin = require('override-mapping-webpack-plugin');
const overrideMapping = require('./override-mapping');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

module.exports = async env => {
    const mediaUrl = await getMediaURL();

    global.MAGENTO_MEDIA_BACKEND_URL = mediaUrl;

    const unionAndInterfaceTypes = await getUnionAndInterfaceTypes();

    const { clientConfig, serviceWorkerConfig } = await configureWebpack({
        context: __dirname,
        vendor: [
            '@apollo/react-hooks',
            'apollo-cache-inmemory',
            'apollo-cache-persist',
            'apollo-client',
            'apollo-link-context',
            'apollo-link-http',
            'informed',
            'react',
            'react-dom',
            'react-feather',
            'react-redux',
            'react-router-dom',
            'redux',
            'redux-actions',
            'redux-thunk'
        ],
        special: {
            'react-feather': {
                esModules: true
            },
            '@magento/peregrine': {
                esModules: true,
                cssModules: true
            },
            '@magento/venia-ui': {
                cssModules: true,
                esModules: true,
                graphqlQueries: true,
                rootComponents: true,
                upward: true
            },
            '@webjump/colmeia': {
                cssModules: true,
                esModules: true,
                graphqlQueries: true,
                rootComponents: false,
                upward: false
            }
        },
        env
    });

    /**
     * configureWebpack() returns a regular Webpack configuration object.
     * You can customize the build by mutating the object here, as in
     * this example. Since it's a regular Webpack configuration, the object
     * supports the `module.noParse` option in Webpack, documented here:
     * https://webpack.js.org/configuration/module/#modulenoparse
     */
    clientConfig.module.noParse = [/braintree\-web\-drop\-in/];
    clientConfig.module.rules.push({
        rules : [
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            },
            {
                test: /\.s[ca]ss$/,
                use: [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                      modules: true,
                      sourceMap: true,
                    },
                  },
                  'sass-loader',
                ],
            }
        ]
    });
    clientConfig.plugins = [
        ...clientConfig.plugins,
        new DefinePlugin({
            /**
             * Make sure to add the same constants to
             * the globals object in jest.config.js.
             */
            UNION_AND_INTERFACE_TYPES: JSON.stringify(unionAndInterfaceTypes),
            STORE_NAME: JSON.stringify('Venia')
        }),

        new webjumpOverrideMappingPlugin(overrideMapping),

        new SVGSpritemapPlugin(['src/assets/icons/**/*.svg'], {
            output: {
                filename: 'sprites.svg',
            },
            sprite: {
                generate: {
                    use: true
                }
            }
        }),

        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './template.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ];

    return [clientConfig, serviceWorkerConfig];
};
