import { changeThemeColor } from './pwa'

export function watch(func) {
    const mediaQueryListDark = window.matchMedia('(prefers-color-scheme: dark)')
    func(mediaQueryListDark.matches ? 'dark' : 'light')
    mediaQueryListDark.addListener(evt => {
        func(evt.matches ? 'dark' : 'light')
    })
}

export default function install(vue, options){
    // 兼容老代码
    let darkMode = {
        'true': 'dark',
        'false': 'light',
        'dark': 'dark',
        'light': 'light',
        'auto': 'auto'
    }[localStorage.getItem('LightNovel_DARK')] || 'auto'
    let systemDark = 'light'


    Object.defineProperty(vue.prototype, '$darkMode', {
        get: function () {
            return darkMode
        },
        set: function (val) {
            darkMode = val
            localStorage.setItem('LightNovel_DARK', darkMode)

            let currDark = darkMode
            if (darkMode == 'auto') {
                currDark = systemDark
            }
            let isDark = currDark == 'dark'
            options.$vuetify.framework.theme.dark = isDark
            changeThemeColor(isDark ? 'black' : '#1976d2')
        }
    })

    watch(flag => {
        systemDark = flag
        vue.prototype.$darkMode = darkMode
    })
}