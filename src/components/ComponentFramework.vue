<template>
    <div>
        <v-app-bar ref="appBar" app clipped-left :color="isDark ? '' : 'primary'" class="white--text">
            <v-app-bar-nav-icon class="white--text" @click="drawer = !drawer"/>
            <v-toolbar-title>轻书架</v-toolbar-title>
        </v-app-bar>
        <v-navigation-drawer app clipped v-model="drawer" :color="isDark ? '' : 'grey lighten-4'">
            <v-list dense>
                <template v-for="(item, i) in items">
                    <v-divider v-if="item.divider" :key="i" class="my-4"/>
                    <v-list-group v-else-if="item.children" :key="i" v-model="item.active" no-action>
                        <template v-slot:activator>
                            <v-list-item-icon>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title class="grey--text">{{ item.text }}</v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <v-list-item
                                link
                                v-for="(subItem, j) in item.children"
                                :key="j"
                                @click="selectNav(subItem['target'])"
                        >
                            <v-list-item-icon>
                                <v-icon>{{ subItem.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title class="grey--text">{{ subItem.text }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-group>
                    <v-list-item v-else :key="i" link @click="selectNav(item['target'])">
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="grey--text">{{ item.text }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
                <v-list-item link @click="selectNav('setting')">
                    <v-list-item-icon>
                        <v-icon>{{ icon.mdiCog }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="grey--text">网站设置</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="selectNav('recruit')">
                    <v-list-item-icon>
                        <v-icon>{{ icon.mdiAccountAlert }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold red--text">书架招募</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-dialog v-model="policy" max-width="500">
            <component-policy @close-policy="closePolicy"></component-policy>
        </v-dialog>
        <v-dialog v-model="recruit" max-width="500">
            <v-card>
                <v-card-title :class="[isDark ? 'blue-grey darken-3' : 'grey lighten-2', 'headline']" primary-title>
                    <span>书架招募</span>
                    <v-spacer/>
                    <v-icon @click="recruit=false">{{ icon.mdiClose }}</v-icon>
                </v-card-title>
                <v-card-text class="pt-5" style="line-height: 1.8em">
                    <b>录入</b>：通过OCR等技术将图片内的文本提取出来，并进行校对，无需技术要求
                    <br/>
                    <b>扫图</b>：使用扫描仪将实体书变成图片，以便下一步工作，需要有扫描仪
                    <br/>
                    <b>修图</b>：将扫图后有缺陷的图片进行美观还原，对PS技术要求很高
                    <br/>
                    <b>ePub制作</b>：需要一定的CSS+HTML基础，熟练使用Sigil软件，能制作良好的ePub，无需精排
                    <br/>
                    <b>图源</b>：出钱购买书籍，请资金充裕的小伙伴不要犹豫
                    <br/><br/>
                    我们近期有大量的旧书ePub重置计划，目前最缺的是<span class="red--text">图源</span>和<span class="red--text">ePub制作</span>
                    ，这些ePub预计不会发布到任何地方，只会组内共享，文本会简化后发布到书架，有想法的小伙伴请通过下面的QQ联系我
                    <br/>
                    我们无法提供什么报酬，单纯用爱发电，但是如果你有想看的书，我们会尽量满足
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text class="pt-5">
                    联系QQ：3117836505
                </v-card-text>
                <v-divider></v-divider>
            </v-card>
        </v-dialog>
        <v-dialog v-model="setting" max-width="500px">
            <v-card class="d-flex pl-3">
                <v-list>
                    <v-list-item>
                        <v-radio-group v-model="darkMode" row>
                            <v-radio label="light" value="light" />
                            <v-radio label="dark" value="dark" />
                            <v-radio label="auto" value="auto" />
                        </v-radio-group>
                    </v-list-item>
                    <v-list-item>
                        <div>
                            <v-list-item-title class="font-weight-bold">阅读背景选项</v-list-item-title>
                            <bg-setting @done="settingDone"></bg-setting>
                        </div>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { icon } from '../plugins/vuetify'
    import ComponentPolicy from '@/components/ComponentPolicy'
    import BgSetting from './BgSetting'
    import { Storage } from '@/util/storage'
    // import { changeThemeColor } from '../plugins/pwa'

    export default {
        name: 'ComponentFramework',
        components: { ComponentPolicy, BgSetting },
        data() {
            return {
                drawer: null,
                dialog: false,
                policy: false,
                policyVersion: '1.1',
                setting: false,
                recruit: false,
                icon: icon,
                items: [
                    { icon: icon.mdiStar, text: '我的书架', target: '/home' },
                    // { icon: icon.mdiHistory, text: '阅读历史', target: '/history' },
                    { divider: true },
                    // {icon: icon.mdiAccountVoice, text: '召唤看板娘', target: 'Summon'},
                    { icon: icon.mdiCurrencyUsd, text: '赞助本站', target: 'usd' },
                    { icon: icon.mdiInformation, text: '关于本站', target: 'Info' }
                ]
            }
        },
        computed: {
            darkMode: {
                get: function() {
                    return this.$darkMode
                },
                set: function(newValue) {
                    this.$darkMode = newValue
                }
            },
            isDark: {
                get: function() {
                    return this.$vuetify.theme.dark
                },
                // set: function(newValue) {
                //     this.$vuetify.theme.dark = newValue
                //     localStorage.setItem('LightNovel_DARK', newValue)
                //     changeThemeColor(newValue ? 'black' : '#1976d2')
                // }
            }
        },
        methods: {
            selectNav(target) {
                if (window.innerWidth < 1264) {
                    this.drawer = false
                }
                if (target === 'Info') {
                    this.policy = true
                } else if (target === 'setting') {
                    this.setting = true
                } else if (target === 'usd') {
                    window.open('https://afdian.net/@wuyu8512', '_blank')
                } else if (target == 'recruit') {
                    this.recruit = true
                } else {
                    this.$router.push({ path: target })
                }
            },
            closePolicy() {
                this.policy = false
            },
            settingDone () {
                this.setting = false
            }
        },
        watch: {
            policy() {
                if (!this.policy) {
                    Storage.write('LightNovel_Policy_Confrirm', this.policyVersion)
                }
            }
        },
        mounted() {
            if (Storage.read('LightNovel_Policy_Confrirm') !== this.policyVersion) {
                this.policy = true
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
