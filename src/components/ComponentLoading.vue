<template>
    <!--    <v-overlay :opacity="0.6" :z-index="1" :absolute="true" :value="display">-->
    <!--        <v-progress-circular :size="70" :width="8" color="white" indeterminate></v-progress-circular>-->
    <!--    </v-overlay>-->
    <v-snackbar top :value="display" class="m-snackbar">
        <span class="pr-4">正在拼命加载中</span>
        <v-progress-circular color="white" indeterminate></v-progress-circular>
    </v-snackbar>
</template>

<script>
    export default {
        name: 'ComponentLoading',
        props: {
            display: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style scoped>
    ::v-deep .v-snack__wrapper {
        min-width: 0;
    }
</style>
