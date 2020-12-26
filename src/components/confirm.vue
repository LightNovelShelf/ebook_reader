<template>
    <v-dialog v-model="show" :width="width" :max-width="maxWidth">
        <v-card>
            <v-card-title class="headline">{{ title }}</v-card-title>
            <v-card-text>{{ context }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="reject">取消</v-btn>
                <v-btn color="green" text @click="resolve">确认</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'Confirm',

        data() {
            return {
                show: false,
                title: '',
                context: '',
                resolve: null,
                reject: null,
                width: 'unset',
                maxWidth: '50%'
            }
        },
        methods: {
            confirm(title = '', context = '', options = {}) {
                if (!title && !context) {
                    return console.warn('给点提示嘞。。。')
                }
                let resolve, reject
                let promise = new Promise((res, rej) => {
                    resolve = () => {
                        res()
                        this.show = false
                    }
                    reject = () => {
                        rej()
                        this.show = false
                    }
                })
                Object.assign(
                    this,
                    {
                        show: true,
                        title,
                        context,
                        resolve,
                        reject,
                        width: 'unset',
                        maxWidth: '50%'
                    },
                    options
                )
                return promise
            }
        }
    }
</script>
