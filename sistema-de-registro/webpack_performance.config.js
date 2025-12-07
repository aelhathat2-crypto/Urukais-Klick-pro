/**
 * CONFIGURACIÓN WEBPACK PARA OPTIMIZACIÓN DE RENDIMIENTO - URUKAIS KLICK
 * Desarrollado por: MiniMax Agent
 * Fecha: 2025-11-16
 * 
 * Funcionalidades:
 * - Bundling optimizado
 * - Code splitting
 * - Tree shaking
 * - Compresión de assets
 * - Minificación avanzada
 * - Análisis de bundle
 */

const path = require('path');
const webpack = require('webpack');

// Plugins necesarios
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackPwaManifest = require('webpack-pwa-manifest');
const GenerateSWPlugin = require('generate-sw-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Configuración base
const isProduction = process.env.NODE_ENV === 'production';
const isAnalyze = process.env.ANALYZE === 'true';

const config = {
  // Configuración básica
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  
  // Punto de entrada
  entry: {
    'urukais-klick': './src/main.js',
    'vendor': './src/vendor.js'
  },
  
  // Configuración de salida
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction 
      ? 'js/[name].[contenthash].min.js'
      : 'js/[name].js',
    chunkFilename: isProduction
      ? 'js/[name].[contenthash].chunk.js'
      : 'js/[name].chunk.js',
    clean: true,
    assetModuleFilename: isProduction
      ? 'assets/[name].[contenthash][ext]'
      : 'assets/[name][ext]',
    publicPath: '/'
  },
  
  // Configuración de módulos
  module: {
    rules: [
      // JavaScript/TypeScript
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions', 'not dead']
                },
                useBuiltIns: 'usage',
                corejs: 3
              }],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              isProduction && 'transform-remove-console'
            ].filter(Boolean)
          }
        }
      },
      
      // CSS
      {
        test: /\.css$/,
        use: [
          isProduction 
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: !isProduction
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProduction,
              plugins: [
                require('autoprefixer'),
                require('cssnano')({
                  preset: ['default', {
                    discardComments: {
                      removeAll: true
                    }
                  }]
                }) if isProduction
              ].filter(Boolean)
            }
          }
        ]
      },
      
      // Sass/SCSS
      {
        test: /\.(scss|sass)$/,
        use: [
          isProduction 
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      
      // Imágenes y assets
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb
          }
        },
        generator: {
          filename: isProduction
            ? 'images/[name].[contenthash][ext]'
            : 'images/[name][ext]'
        }
      },
      
      // Fuentes
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: isProduction
            ? 'fonts/[name].[contenthash][ext]'
            : 'fonts/[name][ext]'
        }
      },
      
      // Videos
      {
        test: /\.(mp4|webm|ogg)$/,
        type: 'asset/resource',
        generator: {
          filename: isProduction
            ? 'videos/[name].[contenthash][ext]'
            : 'videos/[name][ext]'
        }
      },
      
      // Datos JSON
      {
        test: /\.json$/,
        type: 'asset/resource',
        generator: {
          filename: isProduction
            ? 'data/[name].[contenthash][ext]'
            : 'data/[name][ext]'
        }
      }
    ]
  },
  
  // Resolución de módulos
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets')
    }
  },
  
  // Optimización
  optimization: {
    // Minificación
    minimize: isProduction,
    minimizer: isProduction ? [
      // JavaScript minification
      new TerserPlugin({
        terserOptions: {
          ecma: 2020,
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false
          },
          mangle: {
            safari10: true
          },
          output: {
            comments: false,
            ascii_only: true,
            beautify: false,
            quote_keys: true,
            wrap_iife: true
          }
        },
        extractComments: false,
        parallel: true,
        cache: true
      }),
      
      // CSS minification
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', {
            discardComments: {
              removeAll: true
            }
          }]
        }
      })
    ] : [],
    
    // Code splitting
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 10
        },
        
        // React libraries
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20
        },
        
        // Common utilities
        utils: {
          test: /[\\/]src[\\/](utils|helpers)[\\/]/,
          name: 'utils',
          chunks: 'all',
          priority: 5
        },
        
        // Urukais specific modules
        urukais: {
          test: /[\\/]src[\\/](urukais|characteristic|location)[\\/]/,
          name: 'urukais',
          chunks: 'all',
          priority: 15
        }
      }
    },
    
    // Runtime chunk para mejor caching
    runtimeChunk: {
      name: 'runtime'
    },
    
    // Named chunks
    namedChunks: true,
    
    // concatenate modules (scope hoisting)
    concatenated: true
  },
  
  // Plugins
  plugins: [
    // Definir variables de entorno
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.API_URL': JSON.stringify(process.env.API_URL || '/api'),
      'process.env.ANALYTICS_ID': JSON.stringify(process.env.ANALYTICS_ID || ''),
      'process.env.CDN_URL': JSON.stringify(process.env.CDN_URL || '')
    }),
    
    // Mini CSS Extract
    ...(isProduction ? [
      new MiniCssExtractPlugin({
        filename: isProduction
          ? 'css/[name].[contenthash].min.css'
          : 'css/[name].css',
        chunkFilename: isProduction
          ? 'css/[name].[contenthash].chunk.css'
          : 'css/[name].chunk.css',
        ignoreOrder: false
      })
    ] : []),
    
    // Service Worker Generation
    new GenerateSWPlugin({
      swDest: 'sw.js',
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-stylesheets',
            expiration: {
              maxEntries: 4,
              maxAgeSeconds: 365 * 24 * 60 * 60
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 4,
              maxAgeSeconds: 365 * 24 * 60 * 60
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60
            }
          }
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 365 * 24 * 60 * 60
            }
          }
        }
      ]
    }),
    
    // PWA Manifest
    new WebpackPwaManifest({
      name: 'Urukais Klick - Ecosistema Alforja',
      short_name: 'Urukais',
      description: 'Explora el ecosistema misterioso de Urukais en la Serra de Prades',
      background_color: '#0a0e27',
      theme_color: '#6b46c1',
      display: 'standalone',
      orientation: 'portrait-primary',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: path.resolve(__dirname, 'src/assets/icons/icon-72x72.png'),
          sizes: [72, 96, 128, 144, 152, 192, 384, 512],
          type: 'image/png'
        },
        {
          src: path.resolve(__dirname, 'src/assets/icons/maskable-icon-192x192.png'),
          sizes: [192, 512],
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    }),
    
    // Compresión
    ...(isProduction ? [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8
      }),
      
      new CompressionPlugin({
        algorithm: 'brotli',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8,
        compressionOptions: {
          level: 11
        }
      })
    ] : []),
    
    // Copiar archivos estáticos
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/images',
          to: 'images',
          globOptions: {
            ignore: ['**/*.map']
          }
        },
        {
          from: 'src/assets/videos',
          to: 'videos',
          globOptions: {
            ignore: ['**/*.map']
          }
        },
        {
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/*.map']
          }
        }
      ]
    })
  ].filter(Boolean),
  
  // Configuración de dev server
  ...(isProduction ? {} : {
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 3000,
      hot: true,
      open: true,
      historyApiFallback: true,
      compress: true,
      client: {
        overlay: true,
        logging: 'warn'
      },
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin'
      }
    }
  }),
  
  // Configuración de rendimiento
  performance: {
    hints: isProduction ? 'warning' : false,
    maxAssetSize: 512000,
    maxEntrypointSize: 512000
  }
};

// Añadir bundle analyzer en modo análisis
if (isAnalyze) {
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-analysis.html'
    })
  );
}

module.exports = config;