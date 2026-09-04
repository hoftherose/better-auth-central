import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
    {
        ignores: ['.nuxt/', '.output/', 'node_modules/', 'dist/']
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser
        },
        rules: {
            indent: ['error', 4]
        }
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.vue'],
                sourceType: 'module'
            }
        },
        plugins: {
            vue: pluginVue
        },
        rules: {
            'vue/html-indent': ['error', 4],
            indent: 'off'
        }
    }
)
