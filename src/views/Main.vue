<template>
    <v-app>
        <component-framework ref="framework"></component-framework>
        <v-main :style="{ height: getHeight() }" id="main">
            <router-view></router-view>
        </v-main>

        <message ref="message" />
        <confirm ref="confirm" />
    </v-app>
</template>

<script>
    import ComponentFramework from '@/components/ComponentFramework'
    import Confirm from '@/components/confirm.vue'
    import Message from '@/components/message.vue'

    export default {
        name: 'Main',
        provide() {
            return {
                app: this,
                confirm: (...args) => this.$refs['confirm'].confirm(...args),
                message: (...args) => this.$refs['message'].message(...args)
            }
        },
        components: {
            ComponentFramework,
            Confirm,
            Message
        },
        data() {
            return {
                toolbar: Object
            }
        },
        methods: {
            getHeight() {
                if (['Home', 'History'].includes(this.$route.name)) {
                    return 'auto'
                } else {
                    return '100vh'
                }
            }
        },
        mounted() {
            this.content = document.querySelector('.v-main__wrap')
            this.content.style.overflowY = 'auto'
            // this.content.style.overflowX = 'hidden'
        },
        beforeRouteUpdate(from, to, next) {
            // 任何路由跳转，还原AppBar
            this.$refs.framework.$refs.appBar.isActive = true
            next()
        }
    }
</script>

<style scoped></style>
