<template>
    <v-container v-if="pageData !== null">
        <draggable
            :value="pageDataList"
            :move="checkMove"
            :disabled="!enableDrag"
            :animation="500"
            :preventOnFilter="false"
            @start="startMove"
            @end="endMove"
            @input="changeMove"
            filter=".no-move"
            handle=".drag"
            ref="draggable"
        >
            <transition-group tag="VRow" type="transition" name="flip-list">
                <v-col
                    :class="{
                        'no-move': book.holder,
                        move: anim && !book.holder
                    }"
                    cols="6"
                    sm="4"
                    md="3"
                    lg="2"
                    v-for="(book, idx) in pageDataList"
                    :key="`${book.gid}_${book.bid}`"
                    :data-idx="idx"
                >
                    <div
                        v-if="book.bid"
                        class="card-box drag"
                        v-longclick="() => (fab ? null : onLongTouch(book))"
                        @click="() => (fab ? toggleSelect(book) : null)"
                    >
                        <v-badge
                            color="pink"
                            dot
                            style="display: block"
                            :value="book.localUpdate !== book.data.last_update_time"
                        >
                            <component-book-card
                                class="bookInfo"
                                :book-info="book.data"
                                :key="book.bid"
                            ></component-book-card>
                        </v-badge>
                        <v-overlay class="overlay" absolute :opacity="0.3" :value="fab">
                            <v-btn class="btn-select" :color="checkIsSelect(book) ? 'green' : 'white'" fab x-small>
                                <v-icon>{{ icon.mdiCheckBold }}</v-icon>
                            </v-btn>
                        </v-overlay>
                    </div>
                    <template v-else>
                        <div class="card-box drag">
                            <component
                                :is="fab ? 'div' : 'router-link'"
                                :to="{ name: 'Bookshelf', params: { gid: book.gid } }"
                                tag="div"
                            >
                                <v-card :elevation="lastMoveTarget === book.gid ? 20 : 2" ripple :key="book.gid">
                                    <v-responsive
                                        :aspect-ratio="2 / 3"
                                        v-longclick="() => (fab ? null : onLongTouch(book))"
                                        @click="() => (fab ? toggleSelect(book) : null)"
                                    >
                                        <v-row
                                            class="fill-height ma-0"
                                            dense
                                            :justify="book.books.length ? 'start' : 'center'"
                                            :align="book.books.length ? 'start' : 'center'"
                                            style="border: 2px solid #cccccc"
                                            :style="`align-content: ${book.books.length ? 'flex-start' : 'normal'};`"
                                        >
                                            <v-icon v-if="!book.books.length" :size="100" color="#bbbbbb">{{
                                                icon.mdiFolderOpen
                                            }}</v-icon>
                                            <template v-else>
                                                <v-col
                                                    v-for="(b, i) in book.books.slice(0, 9)"
                                                    :key="i"
                                                    :cols="b && b.cols"
                                                    class="group-cover"
                                                >
                                                    <v-badge
                                                        color="pink"
                                                        dot
                                                        style="position: absolute; top: 6px; right: 6px"
                                                        :value="b.localUpdate !== b.data.last_update_time"
                                                    >
                                                    </v-badge>
                                                    <img
                                                        v-show="b.data.book_id"
                                                        class="group-cover-img"
                                                        :src="b.data.book_cover"
                                                        :alt="b.data.book_title"
                                                    />
                                                </v-col>
                                            </template>
                                        </v-row>
                                    </v-responsive>
                                    <v-card-subtitle class="pa-2 d-flex" style="height: 60px">
                                        <div style="height: 100%" class="d-flex flex-column justify-center">
                                            <div class="font-weight-black category-text pl-2 ellipsis2">
                                                {{ book.data.title }}
                                            </div>
                                        </div>
                                    </v-card-subtitle>
                                </v-card>
                            </component>
                            <v-overlay class="overlay" absolute :opacity="0.3" :value="fab">
                                <v-btn
                                    class="btn-select"
                                    :color="checkIsSelect(book) ? 'green' : 'white'"
                                    fab
                                    x-small
                                    @click="() => (fab ? toggleSelect(book) : null)"
                                >
                                    <v-icon>{{ icon.mdiCheckBold }}</v-icon>
                                </v-btn>
                            </v-overlay>
                        </div>
                    </template>
                </v-col>
            </transition-group>
        </draggable>
        <component-loading :display="loading"></component-loading>
        <template>
            <div class="float-box">
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <v-fab-transition>
                            <v-btn
                                dark
                                fab
                                color="error"
                                v-on="on"
                                class="mb-4"
                                @click="confirmDelete"
                                v-if="!loading && fab"
                                :small="isMobileLayout"
                            >
                                <v-icon>{{ icon.mdiTrashCanOutline }}</v-icon>
                            </v-btn>
                        </v-fab-transition>
                    </template>
                    <span>删除</span>
                </v-tooltip>
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <v-fab-transition>
                            <v-btn
                                color="primary"
                                class="mb-4"
                                dark
                                fab
                                v-on="on"
                                @click="openMoveToDialog"
                                v-if="!loading && fab"
                                :small="isMobileLayout"
                            >
                                <v-icon>{{ icon.mdiArrowRightBoldBoxOutline }}</v-icon>
                            </v-btn>
                        </v-fab-transition>
                    </template>
                    <span>移动</span>
                </v-tooltip>
                <v-fab-transition>
                    <v-btn dark fab color="white" @click="toggleFab" v-if="!loading && fab" :small="isMobileLayout">
                        <v-badge color="primary" :content="`${compSelected.list.length}`">
                            <v-icon color="grey darken-4">{{ icon.mdiClose }}</v-icon>
                        </v-badge>
                    </v-btn>
                </v-fab-transition>
            </div>
            <div class="float-box">
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <v-fab-transition>
                            <v-btn
                                color="primary"
                                class="mb-4"
                                dark
                                fab
                                v-on="on"
                                @click="openGroupEditDialog"
                                v-if="!loading && gid && !fab"
                                :small="isMobileLayout"
                            >
                                <v-icon>{{ icon.mdiSquareEditOutline }}</v-icon>
                            </v-btn>
                        </v-fab-transition>
                    </template>
                    <span>修改组名</span>
                </v-tooltip>
            </div>
        </template>

        <v-dialog v-model="showMoveDialog" scrollable max-width="380">
            <v-card>
                <v-card-title class="headline">移动到...</v-card-title>
                <v-list v-if="!newGroup.edit">
                    <v-list-item-group v-model="focusedGroup" color="primary">
                        <v-list-item v-for="group in groups" :key="group.gid">
                            <v-list-item-avatar>
                                <v-icon>{{ icon.mdiFolderOpen }}</v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title v-text="group.data.title"></v-list-item-title>
                                <!-- <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle> -->
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>

                    <v-list-item @click="newGroup.edit = true">
                        <v-list-item-avatar>
                            <v-icon>{{ icon.mdiPlus }}</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content> 添加分组 </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-list-item v-else>
                    <v-list-item-avatar>
                        <v-icon>{{ icon.mdiPlus }}</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-text-field
                            clearable
                            v-bind="newGroup"
                            v-model="newGroup.title"
                            :counter="groupNameMaxLength"
                            :maxlength="groupNameMaxLength"
                            :rules="[(v) => nameExist(v, { gid: '-1' })]"
                        />
                    </v-list-item-content>
                </v-list-item>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        v-if="!newGroup.edit"
                        color="primary darken-1"
                        text
                        :disabled="typeof focusedGroup !== 'number'"
                        @click="moveToGroup(groups[focusedGroup])"
                    >
                        确认
                    </v-btn>
                    <v-btn v-else color="primary darken-1" text :disabled="!newGroup.title" @click="createGroup">
                        确认
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showGroupEditDialog" max-width="380">
            <v-card>
                <v-card-title class="headline primary white--text" primary-title> 修改组名 </v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="groupName"
                        :rules="[(v) => nameExist(v, { gid })]"
                        :counter="groupNameMaxLength"
                        :maxlength="groupNameMaxLength"
                        autofocus
                        @keyup.enter="updateGroup"
                        label="名称"
                        required
                        ref="edit"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue" text @click="showGroupEditDialog = false">关闭</v-btn>
                    <v-btn color="primary" dark @click="updateGroup">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import longclick from '../../plugins/longClick'
    import draggable from 'vuedraggable'
    import ComponentBookCard from '@/components/ComponentBookCard'
    import ComponentLoading from '../../components/ComponentLoading'
    import { icon } from '../../plugins/vuetify'
    // import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

    export default {
        name: 'Bookshelf',
        components: { draggable, ComponentLoading, ComponentBookCard },
        props: {
            gid: {
                type: String,
                default: null
            }
        },
        inject: ['confirm', 'app', 'message'],
        data() {
            return {
                icon,
                loading: true,
                fab: false,
                enableDrag: !('ontouchstart' in window),
                moved: false,
                anim: false,
                lastMoveTarget: null,
                groupNameMaxLength: 40,
                selectedBooks: [],
                showGroupEditDialog: false,
                groupName: '',
                //move to
                showMoveDialog: false,
                focusedGroup: null,
                newGroup: {
                    edit: false,
                    title: '',
                    error: false,
                    errorMessages: ''
                },
                tempMoveList: null
            }
        },
        computed: {
            pageData() {
                return (this.$store.getters.favListCache || []).filter((item) => !item.bid || item.gid === this.gid)
            },
            groups() {
                return [
                    {
                        gid: '_empty_',
                        data: {
                            title: '根目录'
                        }
                    },
                    ...this.$store.getters.allGroup
                ]
            },
            pageDataList() {
                return [
                    ...(this.gid
                        ? [
                              {
                                  holder: true,
                                  back: true,
                                  gid: '_empty_',
                                  data: {
                                      title: '返回上一层'
                                  }
                              }
                          ]
                        : []),
                    ...this.pageData.map((b) => {
                        if (b.bid) return b
                        return {
                            ...b,
                            books: this.getBooksInGroup(b)
                        }
                    })
                ]
            },
            compSelected() {
                return this.$store.getters.mapList(this.selectedBooks)
            },
            compAllSelected() {
                return !!this.gid && this.pageData.length === this.compSelected.list.length
            },
            isMobileLayout() {
                return this.app.$vuetify.breakpoint.xsOnly
            }
        },
        methods: {
            goBack() {
                if (!this.fab) {
                    this.$router.push({ name: 'Home' })
                }
            },
            nameExist(value, { gid }) {
                if (!value || !value.trim().length) {
                    return '不能为空'
                }
                if (value.length > this.groupNameMaxLength) {
                    return '长度不能超过20'
                }
                if (this.$store.getters.cacheTitleExist(value, gid)) {
                    return '分组已存在'
                }
                return true
            },
            toggleFab() {
                this.fab = !this.fab
                if (!this.fab) {
                    this.refresh()
                    this.lastMoveTarget = null
                    this.selectedBooks = []
                }
            },
            refresh(param = { gid: this.gid }) {
                this.loading = true
                return this.$store.dispatch('loadFavorites', param).then((loaded) => {
                    this.loading = !loaded
                    if (this.content) {
                        this.content.scrollTop = 0
                    } else {
                        this.content = document.querySelector('.v-main__wrap')
                    }
                    setTimeout(() => {
                        this.toggleAnim(true)
                    }, 300)
                })
            },
            onLongTouch(book) {
                if (!this.moved) {
                    this.fab = true
                    this.toggleSelect(book, 1)
                }
            },
            checkIsSelect(book) {
                let key = `${book.gid}_${book.bid}`
                return !!this.selectedBooks.find(({ gid, bid }) => `${gid}_${bid}` === key)
            },
            toggleSelect(book, forceSelect) {
                let key = `${book.gid}_${book.bid}`
                let add
                if (forceSelect === 1) {
                    add = true
                } else if (forceSelect === -1) {
                    add = false
                } else {
                    add = !this.checkIsSelect(book)
                }
                if (add) {
                    this.selectedBooks = [...this.selectedBooks, book]
                } else {
                    this.selectedBooks = this.selectedBooks.filter(({ gid, bid }) => `${gid}_${bid}` !== key)
                }
            },
            updateGroup(title, group) {
                this.$store
                    .dispatch('updateFavoriteGroup', {
                        gid: this.gid,
                        data: { title: this.groupName }
                    })
                    .then(() => {
                        this.showGroupEditDialog = false
                        this.message('组名修改成功', 800)
                    })
            },
            checkMove({ relatedContext, draggedContext }) {
                this.moved = true
                if (relatedContext.element.add) {
                    return false
                }
                if (draggedContext.element.bid) {
                    // move book
                    if (!relatedContext.element.bid && relatedContext.element.gid) {
                        this.lastMoveTarget = relatedContext.element.gid
                    } else {
                        this.lastMoveTarget = null
                    }
                    return !!relatedContext.element.bid
                } else {
                    // move group
                    this.lastMoveTarget = null
                    return !relatedContext.element.bid
                }
            },
            startMove() {
                this.moved = true
                this.toggleAnim(false, true)
            },
            endMove(evt) {
                this.moved = false
                let idx = evt.item.dataset.idx
                let dragItem = this.pageDataList[idx]
                if (dragItem.bid && this.lastMoveTarget) {
                    // add item to group
                    this.toggleAnim(true)
                    this.$store
                        .dispatch('updateFavorite', {
                            ...dragItem,
                            gid: this.lastMoveTarget === '_empty_' ? null : this.lastMoveTarget
                        })
                        .then(() => {
                            this.toggleSelect(dragItem, -1)
                            let grp = this.$store.getters.findGroup(this.gid)
                            if (!!this.gid && this.getBooksInGroup(grp).length == 0) {
                                this.fab = false
                                this.selectedBooks = []
                                this.$store.dispatch('removeFavoriteGroup', grp).then(() => {
                                    this.goBack()
                                })
                            } else {
                                this.refresh()
                            }
                        })
                } else {
                    if (this.tempMoveList) {
                        if (dragItem.bid) {
                            let list = this.tempMoveList
                                .filter(({ bid }) => !!bid)
                                .map((item, idx) => {
                                    return {
                                        ...item,
                                        idx
                                    }
                                })
                            this.$store.dispatch('updateFavorite', list).then(() => {
                                this.refresh()
                            })
                        } else {
                            let group = this.tempMoveList
                                .filter(({ bid, gid }) => !bid && !!gid)
                                .map((item, idx) => {
                                    return {
                                        ...item,
                                        idx
                                    }
                                })
                            this.$store.dispatch('updateFavoriteGroup', group).then(() => {
                                this.refresh()
                            })
                        }
                    }
                }
                this.lastMoveTarget = null
                this.tempMoveList = []
            },
            changeMove(newList) {
                this.tempMoveList = newList
            },
            openMoveToDialog() {
                if (this.selectedBooks.length === 0) return
                this.showMoveDialog = true
                this.focusedGroup = null
                let fstSelectBook = this.$store.getters.findFavorite(
                    this.selectedBooks.filter((item) => !!item.bid)[0].bid
                )
                let origTitle = fstSelectBook ? fstSelectBook.data.book_title : '新增分组'
                let title = origTitle
                let ct = 1
                while (this.nameExist(title, { gid: '-1' }) !== true) {
                    title = `${origTitle} (${ct++})`
                }
                this.newGroup = {
                    edit: false,
                    error: false,
                    title: title,
                    errorMessages: ''
                }
            },
            createGroup() {
                let errorMessage = this.nameExist(this.newGroup.title, { gid: '-1' })
                if (errorMessage !== true) {
                    this.newGroup.errorMessages = errorMessage
                } else {
                    this.$store.dispatch('addFavoriteGroup', { title: this.newGroup.title }).then((group) => {
                        this.moveToGroup(group)
                    })
                }
            },
            moveToGroup(group) {
                if (!group || !group.gid) return new Error('请先选择一个分组')
                let gid = group.gid === '_empty_' ? null : group.gid
                let { list } = this.compSelected
                this.$store
                    .dispatch(
                        'updateFavorite',
                        list.map((item) => {
                            return {
                                ...item,
                                gid
                            }
                        })
                    )
                    .then(() => {
                        let grp = this.$store.getters.findGroup(this.gid)
                        if (!!this.gid && this.getBooksInGroup(grp).length == 0) {
                            this.fab = false
                            this.$store.dispatch('removeFavoriteGroup', grp).then(() => {
                                this.goBack()
                            })
                        } else {
                            this.refresh()
                        }
                        this.showMoveDialog = false
                        this.selectedBooks = []
                    })
            },
            confirmDelete() {
                if (this.selectedBooks.length === 0) return
                this.confirm('提示', `确认删除选中的 ${this.compSelected.list.length} 本书？`)
                    .then(() => {
                        let { list, group } = this.compSelected
                        let goBack = false
                        if (this.compAllSelected) {
                            group = [...(group || []), this.$store.getters.findGroup(this.gid)]
                            goBack = true
                        }
                        Promise.all([
                            this.$store.dispatch('removeFromFavorite', list),
                            this.$store.dispatch('removeFavoriteGroup', group)
                        ]).then(() => {
                            this.selectedBooks = []
                            this.fab = false
                            if (goBack) {
                                this.goBack()
                            } else {
                                this.refresh()
                            }
                        })
                    })
                    .catch(() => {})
            },
            openGroupEditDialog() {
                if (!this.gid) return
                let {
                    data: { title }
                } = this.$store.getters.findGroup(this.gid) || {}
                this.groupName = title
                this.showGroupEditDialog = true
            },
            getBooksInGroup(group) {
                let list = this.$store.getters.mapList([group]).list || []
                let count = list.length < 4 ? 4 : 9
                let bk = {
                    cols: count === 4 ? '6' : '4'
                }
                list = [...list.map((b) => Object.assign({}, bk, b))]
                // list = [...list.map(b => Object.assign({}, bk, b.data)), ...new Array(count).fill(bk)];
                // list.length = count;
                return list
            },
            toggleAnim(flag, imm) {
                if (flag) {
                    this.anim = flag
                } else {
                    if (imm) {
                        this.anim = false
                    } else {
                        setTimeout(() => {
                            this.anim = false
                        }, 800)
                    }
                }
            },
            cleanup(listids) {
                return new Promise((r) => {
                    this.confirm('提示', '存在失效书籍，是否清理书架？')
                        .then(() => {
                            this.toggleAnim(false, true)
                            let list = listids.split(',').map((bid) => {
                                return this.$store.getters.findFavorite(bid)
                            })
                            let group = list
                                .reduce((rst, { gid, bid }) => {
                                    if (gid) {
                                        let find = rst.find((item) => item.gid == gid)
                                        if (find) {
                                            find.ct += 1
                                        } else {
                                            rst.push({
                                                group: this.$store.getters.findGroup(gid),
                                                ct: 1,
                                                allCt: this.$store.getters.allList.filter((item) => item.gid == gid)
                                                    .length
                                            })
                                        }
                                    }
                                    return rst
                                }, [])
                                .filter((item) => item.ct == item.allCt)
                                .map((item) => item.group)
                            Promise.all([
                                this.$store.dispatch('removeFromFavorite', list),
                                this.$store.dispatch('removeFavoriteGroup', group)
                            ])
                                .then(() => {
                                    this.refresh()
                                })
                                .then(r)
                        })
                        .catch(r)
                })
            }
        },
        directives: {
            longclick
        },
        created() {
            this.refresh()
        },
        beforeRouteUpdate(to, from, next) {
            this.toggleAnim(false, true)
            this.refresh()
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/styles/mixin';
    .float-box {
        position: fixed;
        right: 24px;
        bottom: 24px;
        display: flex;
        flex-direction: column;
        z-index: 100;
    }

    .card-box {
        position: relative;
        cursor: pointer;
        .overlay {
            bottom: 60px;
            align-items: flex-start !important;
            justify-content: flex-end !important;
            z-index: 3 !important;

            .btn-select {
                margin-top: -16px;
                margin-right: -10px;
            }
        }
        .category-text {
            @include ellipsis2(2);
        }
    }

    .ipt-group {
        ::v-deep .v-text-field__slot {
            font-size: 12px;
        }
        ::v-deep .v-input__icon--clear {
            button {
                width: 14px;
            }
        }
    }

    .group-cover {
        padding: 3px 4px !important;
        position: relative;
        > .group-cover-img {
            width: 100%;
        }
    }
</style>

<style lang="scss">
    .move {
        &.flip-list-move {
            transition: all 0.5s;
        }

        &.flip-list-enter-active,
        &.flip-list-leave-active {
            transition: all 0.5s;
        }

        &.flip-list-leave-active {
            position: absolute;
        }

        &.flip-list-enter,
        &.flip-list-leave-to {
            opacity: 0;
            transform: scale(0);
            max-width: 0;
            flex-basis: 0;
        }
    }
    .card-box {
        .overlay {
            pointer-events: none;
            > .v-overlay__content {
                pointer-events: auto;
            }
        }
        .bookInfo {
            .detail-panel {
                pointer-events: none;
            }
        }
    }
</style>
