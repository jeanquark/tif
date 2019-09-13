<template>
    <v-row no-gutters align="center" justify="center" class="elevation-12 custom-height" style="border: 2px solid green;">
        <v-col cols="2" class="" style="border: 1px solid blue; height: 100%;">
            <v-img src="/images/tifLogo.png" max-height="100%"></v-img>
            <!-- <br /><br /><br /><br /> -->
        </v-col>
        <v-col cols="8" style="border: 1px solid purple; height: 100%;">
            <v-row no-gutters justify="center" align="center" style="border: 1px solid green; height: 80%;">
                <v-col cols="12" style="height: 100%;">
                    <v-row no-gutters justify="center" align="center" style="height: 70%;">
                        <v-col cols="3" align="center" class="justify-center align-center black" style="border: 1px dashed orangered; height: 100%;">
                            <span class="display-1 align-center primary--text font-weight-bold">1</span>
                        </v-col>
                        <v-col cols="3">
                            <h2>2</h2>
                        </v-col>
                        <v-col cols="3">
                            3
                        </v-col>
                        <v-col cols="3">
                            4
                        </v-col>
                    </v-row>
                    <v-row no-gutters justify="center" align="center" style="border: 1px solid grey; height: 30%;">
                        <v-col cols="3" class="justify-center align-center black" style="border: 1px dashed orangered; height: 100%;">
                            <span class="title text-uppercase text-center font-weight-bold white--text">sports</span>
                        </v-col>
                        <v-col cols="3">
                            <span class="text-center text-uppercase" :class="{'title': $vuetify.breakpoint.md}">compétitions</span>
                        </v-col>
                        <v-col cols="3">
                            équipes
                        </v-col>
                        <v-col cols="3">
                            fans
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row no-gutters align="center" style="2px solid brown; height:20%;">
                <v-col cols="12" class="text-left">
                    Welcome jeanquark!
                </v-col>
            </v-row>
            
        </v-col>

        <v-col cols="2" class="" style="border: 1px solid blue;">
            <v-img src="/images/tifLogo.png" max-height="100%"></v-img>
            
        </v-col>
    </v-row>
</template>

<script>
	import firebase from 'firebase/app'
	export default {
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

<!--<style lang="styl" scoped>-->
<style scoped>
    /*.small-height {
        height: 100px;
    }
    .large-height {
        height: 180px;
    }*/
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
</style>