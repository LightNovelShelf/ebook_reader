import {
    Storage
} from '../util/storage'
import {
    trimStr,
    formatDate,
    guid
} from '../util/index'
import { favoriteList } from './mockData'
const LOCAL_FAVORITE_GROUP_KEY = 'LightNovel_FAVORITE_GROUP'
const LOCAL_FAVORITE_LIST_KEY = 'LightNovel_FAVORITE_LIST'
// const LOCAL_FAVORITE_LAST_UPDATE_KEY = 'LightNovel_FAVORITE_LAST_UPDATE'
export default {
    state: {
        group: Storage.read(LOCAL_FAVORITE_GROUP_KEY) || [],
        list: Storage.read(LOCAL_FAVORITE_LIST_KEY) || [],
        favListCache: null
    },
    getters: {
        localFavExist: (state, getters) => {
            return getters.allGroup.length > 0 || getters.allList.length > 0
        },
        allGroup: state => {
            return state.group
        },
        allList: state => {
            return state.list
        },
        favListCache: state => {
            return state.favListCache
        },
        hasGroup: (state, getters) => {
            return gid => {
                // ignroe null group
                if (gid == null) return true
                return !!getters.allGroup.find(item => item.gid == gid)
            }
        },
        groupTitleExist: (state, getters) => {
            return (title, gid) => {
                let str = trimStr(title)
                if (str.length == 0) return true
                return !!getters.allGroup.find(item => item.gid != gid && item.data.title == str)
            }
        },
        cacheTitleExist: (state, getters) => {
            return (title, gid) => {
                let str = trimStr(title)
                if (str.length == 0) return true
                return !!getters.allGroup.find(item => item.gid != gid && item.data.title == str) ||
                    !!getters.favListCache.find(item => !item.bid && item.gid != gid && item.data.title == str)
            }
        },
        hasFavorite: (state, getters) => {
            return bid => {
                return !!getters.allList.find(item => item.bid == bid)
            }
        },
        findFavorite: (state, getters) => {
            return bid => {
                return getters.allList.find(item => item.bid == bid)
            }
        },
        findGroup: (state, getters) => {
            return gid => {
                return getters.allGroup.find(item => item.gid == gid)
            }
        },
        mapList: (state, getters) => {
            return list => {
                return {
                    list: getters.allList.filter(item => !!list.find(({
                        bid,
                        gid
                    }) => (item.bid == bid) || (!bid && item.gid == gid))),
                    group: getters.allGroup.filter(item => !!list.find(({
                        bid,
                        gid
                    }) => !bid && item.gid == gid))
                }
            }
        }
    },
    mutations: {
        updateFavGroup(state, payload) {
            state.group = payload || []
            Storage.write(LOCAL_FAVORITE_GROUP_KEY, state.group)
        },
        updateFavList(state, payload) {
            state.list = payload || []
            Storage.write(LOCAL_FAVORITE_LIST_KEY, state.list)
        },
        // updateLastUpdate(state, paylod) {
        //     state.lastUpdate = paylod || []
        //     Storage.write(LOCAL_FAVORITE_LAST_UPDATE_KEY, state.lastUpdate)
        // },
        updateFavListCache(state, payload) {
            state.favListCache = payload || []
        }
    },
    actions: {
        addFavoriteGroup({
            commit,
            getters,
            dispatch
        }, payload) {
            let {
                title,
                idx = null
            } = payload || {}
            title = trimStr(title)
            if (!getters.groupTitleExist(title)) {
                let newGroup = {
                    gid: guid(),
                    last_update_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:sss'),
                    idx,
                    data: {
                        title
                    }
                }
                let newList = [...getters.allGroup, newGroup]
                commit('updateFavGroup', newList)
                return newGroup
            } else {
                return false
            }
        },
        removeFavoriteGroup({
            commit,
            getters,
            dispatch
        }, payload) {
            if (!Array.isArray(payload)) {
                payload = [payload]
            }
            let newList = getters.allGroup.filter(item => !payload.find(p => p.gid == item.gid))
            commit('updateFavGroup', newList)
            return true
        },
        updateFavoriteGroup({
            commit,
            getters,
            dispatch
        }, payload) {
            if (!Array.isArray(payload)) {
                payload = [payload]
            }
            let newList = getters.allGroup.map(item => {
                let find = payload.find(p => p.gid == item.gid)
                return (find && !getters.groupTitleExist(find.data.title, find.gid)) ? {
                    ...item,
                    ...find,
                    last_update_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:sss'),
                    data: {
                        ...item.data,
                        ...find.data
                    }
                } : item
            })
            commit('updateFavGroup', newList)
            return true
        },

        addToFavorite({
            commit,
            getters,
            dispatch
        }, payload) {
            if (!Array.isArray(payload)) {
                payload = [payload]
            }
            let newList = [...getters.allList, ...payload
                .filter(({
                    bid,
                    gid
                }) => getters.hasGroup(gid) && !getters.hasFavorite(bid))
                .map(({
                    bid,
                    gid = null,
                    data = {},
                    idx = null
                }) => {
                    return {
                        bid,
                        gid,
                        idx,
                        last_update_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:sss'),
                        data,
                        localUpdate: data.last_update_time
                    }
                })
            ]
            commit('updateFavList', newList)
            return true
        },
        removeFromFavorite({
            commit,
            getters,
            dispatch
        }, payload) {
            if (!Array.isArray(payload)) {
                payload = [payload]
            }
            let newList = getters.allList.filter(item => !payload.find(p => p.bid == item.bid))
            commit('updateFavList', newList)
            return true
        },
        updateFavorite({
            commit,
            getters,
            dispatch
        }, payload) {
            if (!Array.isArray(payload)) {
                payload = [payload]
            }
            let newList = getters.allList.map(item => {
                let find = payload.find(p => p.bid == item.bid)
                return (find && getters.hasGroup(find.gid)) ? {
                    ...item,
                    last_update_time: formatDate(new Date(), 'yyyy-MM-dd hh:mm:sss'),
                    ...find,
                    data: {
                        ...item.data,
                        ...find.data
                    }
                } : item
            })
            commit('updateFavList', newList)
            return true
        },
        loadFavorites({
            commit,
            getters
        }, {
            gid
        }) {
            // load cache
            console.log(favoriteList)
            commit('updateFavList', favoriteList)
            let data = getters.allList.filter(item => item.gid == gid)
                .sort(sortFav)
            if (gid == null) {
                let gdata = getters.allGroup
                    .sort(sortFav)
                data = [...gdata, ...data]
            }
            commit('updateFavListCache', JSON.parse(JSON.stringify(data)))
            return true
        },
    }
}
function sortFav(a, b) {
    let aIdx = a.idx || 0
    let bIdx = b.idx || 0
    if (aIdx > bIdx) {
      return 1
    } else if (aIdx < bIdx) {
      return -1
    } else {
      return a.last_update_time > b.last_update_time ? -1 : 1
    }
}