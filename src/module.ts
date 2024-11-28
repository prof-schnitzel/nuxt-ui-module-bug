import { defineNuxtModule, addPlugin, createResolver, addComponentsDir, installModule } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'MyNuxtModule'
    })

    nuxt.hook('tailwindcss:config', function (tailwindConfig) {
      tailwindConfig.content = tailwindConfig.content ?? { files: [] };
      (Array.isArray(tailwindConfig.content) ? tailwindConfig.content : tailwindConfig.content.files).push(resolver.resolve('./runtime/components/**/*.{vue,mjs,ts}'))
    })

    await installModule('@nuxt/ui')
  }
})
