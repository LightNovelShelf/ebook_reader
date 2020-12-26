<template>
    <v-card>
        <v-card-title :class="[isDark ? 'blue-grey darken-3' : 'grey lighten-2', 'headline']" primary-title>
            <span>用户协议</span>
            <v-spacer />
            <v-icon @click="closePolicy">{{ icon.mdiClose }}</v-icon>
        </v-card-title>
        <v-card-text class="pt-5">
            请在使用本站前仔细阅读以下用户协议
            <br />
            <span class="red--text"
                >当您选择继续使用本网站时，您已经完全知晓，认可并同意遵守本协议中的条款。若您对本声明或本协议任何条款有异议，请停止注册或使用轻书架(以下简称：本站)所提供的全部服务。</span
            >
            <br />
            <b>一、协议的接受、变更与补充</b>
            <ol>
                <li>
                    勾选同意协议选项框并点击"注册"，视为您同意本协议，无论是浏览网页，或在本站发布内容，无论是直接或间接的通过各自方式引用本站的服务和数据，都将视为无条件同意本协议
                </li>
                <li>
                    本站有权利对本协议进行修改，修改后，本站会通过公告等方式通知用户，如不同意协议，请立即停用本站，如果您选择继续访问或使用本站，则视为您已接受本协议的修改。
                </li>
            </ol>
            <b>二、法律法规声明</b>
            <ol>
                <li>
                    使用本网站时，用户须遵守国家的法律法规和规章制度，遵守网站有关协议、规定、规则、程序和惯例，不得利用网站从事任何非法或不正当活动。用户不得在本网站发布各类违法或违规信息。
                </li>
            </ol>
            <b>三、知识产权声明</b>
            <br />
            <ol>
                <li> 本站所有内容资源均来自网络&网友分享，仅供学习试用。 </li>
                <li>
                    如果第三方提出关于著作权的异议，本站有权进行独立判断，并采取技术手段予以删除、屏蔽或断开链接，您应当配合。给本站或任何第三方造成损失的，您应负责全部法律责任。
                </li>
            </ol>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="pt-5">
            联系邮箱：<a href="mailto:admin@acgdmzy.com">admin@acgdmzy.com</a>
            <br />
            交流Q群：648300801
            <br />
            Telegram：<a target="_blank" href="https://t.me/joinchat/H6-QtU3SSoSqeTIeFR0wfw">点击加群</a>
        </v-card-text>
        <v-divider></v-divider>
    </v-card>
</template>

<script>
    import { icon } from '../plugins/vuetify'

    export default {
        name: 'ComponentPolicy',
        data() {
            return {
                icon: icon
            }
        },
        computed: {
            isDark() {
                return this.$vuetify.theme.dark
            }
        },
        methods: {
            closePolicy() {
                this.$emit('close-policy')
            }
        }
    }
</script>

<style scoped></style>
