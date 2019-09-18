<template>
    <v-row no-gutters class="elevation-12 custom-height" style="">
        <v-hover v-slot:default="{ hover }">
            <v-col cols="2" class="d-flex justify-center align-center" :class="hover ? 'black' : 'primary'" style="">
                <v-img src="/images/tifLogo.png" max-height="100%" style=""></v-img>
            </v-col>
        </v-hover>
        <v-col cols="8" style="height: 100%;">
            <v-row no-gutters justify="center" align="center" style="height: 80%;">
                <v-col cols="12" align-self="stretch">
                    <v-row no-gutters style="height: 70%;">
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="">
                                <h1 :class="hover ? 'white--text' : 'primary--text'">1</h1>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="">
                                <h1 :class="hover ? 'white--text' : 'primary--text'">2</h1>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="border: 1px dashed red;">
                                <h1 :class="hover ? 'white--text' : 'primary--text'">3</h1>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="border: 1px dashed primary;">
                                <h1 :class="hover ? 'white--text' : 'primary--text'">4</h1>
                            </v-col>
                        </v-hover>
                    </v-row>
                    <v-row no-gutters style="height: 30%;">
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="">
                                <span class="text-uppercase custom-font white--text">sports</span>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="">
                                <span class="text-uppercase custom-font white--text">compétitions</span>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="border: 1px dashed primary;">
                                <span class="text-uppercase custom-font white--text">équipes</span>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="border: 1px dashed primary;">
                                <span class="text-uppercase custom-font white--text">fans</span>
                            </v-col>
                        </v-hover>
                    </v-row>
                </v-col>
            </v-row>
            <v-row no-gutters align="center" class="primary" style="height:20%;">
                <v-col cols="6" class="text-left white--text">
                    <span class="custom-font">Welcome jeanquark!</span>
                </v-col>
                <v-col cols="6" class="text-right white--text">
                    <v-btn x-small to="/admin" class="success">Admin</v-btn>
                </v-col>
            </v-row>
            
        </v-col>
        
        <v-hover v-slot:default="{ hover }">
            <v-col cols="2" class="d-flex justify-center align-center" :class="hover ? 'black' : 'primary'" style="">
                <v-img src="/images/tifLogo.png"></v-img>
            </v-col>
        </v-hover>
    </v-row>
</template>

<script>
    import firebase from 'firebase/app'
    export default {
        mounted () {
            console.log('breakpoint: ', this.$vuetify.breakpoint)
        },
        data() {
            return {}
        },
        computed: {
            loadedUser() {
                return this.$store.getters['users/loadedUser']
            }
        },
        methods: {
            async logout() {
                console.log('logout')
                await this.$store.dispatch('firebase-auth/signOut')
                this.$router.push('/')
            }
        }
    }
</script>

<style scoped>
    .custom-height {
        height: 180px;
    }
    .custom-font {
        font-size: 1.2em;
        font-weight: bold;
    }
    .primary:hover {
        cursor: pointer;
    }
    @media screen and (max-width: 960px) {
        .custom-height {
            height: 150px;
            /*height: 100px;*/
        }
        .custom-font {
            font-size: .8em;
        }
    }
    @media screen and (max-width: 600px) {
        .custom-height {
            height: 100px;
        }
        .custom-font {
            font-size: .6em;
        }
    }
</style>