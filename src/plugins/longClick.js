let delay = 500

export default {
    bind: function (el, binding, vNode) {
        if (typeof binding.value !== 'function') {
            // eslint-disable-line
            const compName = vNode.context.name
            let warn = `[longclick:] provided expression '${binding.expression}' is not a function, but has to be`
            if (compName) {
                warn += `Found in component '${compName}' `
            }
            console.warn(warn)
        }

        let isTouch = false
        let pressTimer = null
        let fired = false
        const start = (e) => {
            if (e.button === 2) {
                return
            }
            if (e.type === 'click' && e.button !== 0) {
                console.log('bug exception!!', e.type, e.button)
                return
            }
            fired = false
            clearTimeout(pressTimer)
            pressTimer = setTimeout(() => {
                handler()
            }, delay)
            console.log('wait longTouch', pressTimer, e.type, e.button)
            isTouch = e.type === 'touchstart'
        }
        // Cancel Timeout
        const cancel = (e) => {
            if (pressTimer !== null && !(isTouch && e.type === 'mousemove')) {
                console.log('longTouch cancel', pressTimer, e.type, e.button)
                clearTimeout(pressTimer)
                pressTimer = null
                if (fired) {
                    e.preventDefault && e.preventDefault()
                }
                fired = false
            }
        }
        // Run Function
        const handler = () => {
                console.log('longTouch fire', pressTimer)
                fired = true
                binding.value()
            }
        ;['mousedown', 'touchstart'].forEach(e => el.addEventListener(e, start))
        ;['click', /*'mousemove',*/'mouseup', 'mouseout', 'touchmove', 'touchend', 'touchcancel'].forEach(e => el.addEventListener(e, cancel))
    }
}