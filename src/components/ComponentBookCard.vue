<template>
    <component
        :is="'router-link'"
        :to="{ name: 'Read', params: { id: bookInfo['book_id'] } }"
        tag="div"
    >
        
            <v-card ripple>
                <v-img :aspect-ratio="2 / 3" :src="this.bookInfo['book_cover']">
                    <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="blue-grey lighten-3"></v-progress-circular>
                        </v-row>
                    </template>
                </v-img>
                <v-card-subtitle class="pa-2 d-flex" style="height: 60px">
                    <div style="height: 100%" class="d-flex flex-column justify-center">
                        <div
                            class="category-chip text-no-wrap hidden-lg-and-down white--text"
                            :style="{ backgroundColor: bookInfo['category']['color'] }"
                        >
                            {{ bookInfo['category']['name'] }}
                        </div>
                    </div>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <div style="height: 100%" class="d-flex flex-column justify-center">
                                <v-icon
                                    size="22"
                                    class="mr-2 hidden-xl-only"
                                    :color="bookInfo['category']['color']"
                                    v-on="on"
                                >
                                    {{ icon.mdiCircle }}
                                </v-icon>
                            </div>
                        </template>
                        <span>{{ bookInfo['category']['name'] }}</span>
                    </v-tooltip>
                    <div style="height: 100%" class="d-flex flex-column justify-center">
                        <div class="font-weight-black category-text">
                            {{ bookInfo['book_title'] }}
                        </div>
                    </div>
                </v-card-subtitle>
            </v-card>
       
    </component>
</template>

<script>
    import { icon } from '../plugins/vuetify'

    export default {
        name: 'ComponentBookCard',
        data: () => ({
            icon: icon
        }),
        props: {
            bookInfo: Object
        },
        computed: {
        }
    }
</script>

<style scoped lang="scss">
    @import '../assets/styles/mixin';

    .detail-panel {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 5px;
        background-color: rgba(0, 0, 0, 0.5);

        .book-name {
            color: rgb(255, 255, 255);
            font-size: 14px;
            margin-bottom: 4px;
        }

        .latest {
            color: rgb(244, 244, 244);
            font-size: 12px;
            margin-bottom: 0;
        }
    }

    .card-detail-enter,
    .card-detail-leave-to {
        transform: translateY(420px);
    }

    .card-detail-enter-active,
    .card-detail-leave-active {
        transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .category-chip {
        border-radius: 4px;
        padding: 0 8px;
        margin-right: 8px;
    }

    .category-text {
        @include ellipsis2(2);
    }

    ::v-deep .v-card {
        cursor: pointer;
    }
</style>
