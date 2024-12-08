// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  // pages: true,
  // ssr: true,
  css: [
    // '~/assets/css/tailwind.css',
    'bootstrap/dist/css/bootstrap.min.css',
  ],
  plugins: [
    '~/plugins/utils.js',
  ],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', // Font Awesome CDN
        },
      ],
    },
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
  }
})
