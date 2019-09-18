<template>
    <v-row no-gutters class="elevation-12 custom-height" style="">
		<v-hover v-slot:default="{ hover }">
			<v-col cols="2" class="d-flex justify-center align-center" :class="hover ? 'black' : 'primary'" style="" @click="redirectTo('/gamemode')">
				<v-img src="/images/tifLogo.png" max-height="100%" style=""></v-img>
			</v-col>
		</v-hover>
        <v-col cols="8" style="height: 100%;">
            <v-row no-gutters justify="center" align="center" style="height: 80%;">
                <v-col cols="12" align-self="stretch">
                    <v-row no-gutters style="height: 70%;">
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="border: 1px dashed red;" @click="redirectTo('/teams')">
                                <h1 :class="hover ? 'white--text' : 'primary--text'">{{ loadedUserTeams.length }}</h1>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="">
                                <h1 :class="hover ? 'white--text' : 'primary--text'">1</h1>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="">
                                <h1 :class="hover ? 'white--text' : 'primary--text'">120</h1>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="border: 1px dashed primary;">
                                <h1 :class="hover ? 'white--text' : 'primary--text'">580</h1>
                            </v-col>
                        </v-hover>
                    </v-row>
                    <v-row no-gutters style="height: 30%;">
                        
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="border: 1px dashed primary;">
                                <span class="text-uppercase custom-font white--text">mes équipes</span>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="border: 1px dashed primary;">
                                <span class="text-uppercase custom-font white--text">Niveau</span>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="">
                                <span class="text-uppercase custom-font white--text">$fans</span>
                            </v-col>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                            <v-col cols="3" class="d-flex justify-center align-center" :class="hover ? 'primary' : 'black'" style="">
                                <span class="text-uppercase custom-font white--text">tokens</span>
                            </v-col>
                        </v-hover>
                    </v-row>
                </v-col>
            </v-row>
            <v-row no-gutters align="center" class="primary" style="height:20%;">
				<v-col cols="6" class="text-left white--text">
                    <span class="">Welcome jeanquark!</span>
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
			},
            loadedUserTeams() {
                return this.$store.getters['userTeams/loadedUserTeams']
            }
		},
		methods: {
			async logout() {
				console.log('logout')
				await this.$store.dispatch('firebase-auth/signOut')
				this.$router.push('/')
			},
            redirectTo(route) {
                this.$router.push(route)
            }
		}
	}
</script>

<!--<style scoped>
    .custom-height {
        @media $this.$vuetify.breakpoints.sm-only {
            height: 20px;
        }
    }
    .small-height {
        height: 20px;
    }
    .large-height {
        height: 300px;
    }
    /*.custom-height
        height 100px
        @media $display-breakpoints.xs-only
            height 100px
        @media $display-breakpoints.lg-and-up
            height 180px
    .custom-font
        font-size 3em
        @media $display-breakpoints.xs-only
            font-size 2em
        @media $display-breakpoints.lg-and-up
            font-size 5em*/
</style>-->
    <!-- .custom-selector
        font-size 3em
        @media $display-breakpoints.xs-only
            font-size 2em
        @media $display-breakpoints.lg-and-up
            font-size 5em -->

<style lang="sass">
    .red2
        color: red
</style>

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