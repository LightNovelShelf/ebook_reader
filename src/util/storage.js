export class Storage {
    constructor() {
    }

    static read(name) {
        try {
            return JSON.parse(window.localStorage.getItem(name))
        } catch (e) {
            console.log(e)
        }
        return null
    }

    static write(name, value) {
        try {
            if (value == null) {
                localStorage.removeItem(name)
            } else {
                localStorage.setItem(name, JSON.stringify(value))
            }
        } catch (e) {
            console.log(e)
        }
    }
}