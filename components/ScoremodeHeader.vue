<template>
    <v-row no-gutters align="center" justify="center" class="elevation-12" style="height: 169px;">
        <v-col cols="2" class="primary">
            <v-img src="/images/tifLogo.png"></v-img>
        </v-col>
        <v-col cols="8" style="height: 169px;">
            <v-row no-gutters style="border: 0px solid green; height: 80%;">
                <v-hover v-slot:default="{ hover }">
                    <v-col cols="3" :class="hover ? 'primary' : 'black'" style="border: 1px solid orange;">
                        <v-row no-gutters justify="center" align="center" style="border: 1px dashed red; height: 70%;">
                            <span class="display-1 font-weight-bold mt-5" :class="hover ? 'white--text' : 'primary--text'">1</span>
                        </v-row>
                        <v-row no-gutters justify="center" align="center" style="border: 1px dashed red; height: 30%;">
                            <span class="text-uppercase text-center font-weight-bold white--text">sport</span>
                        </v-row>
                    </v-col>
                </v-hover>
                <v-hover v-slot:default="{ hover }">
                    <v-col cols="3" :class="hover ? 'primary' : 'black'" style="border: 1px solid orange;">
                        <v-row no-gutters justify="center" align="center" style="border: 1px dashed red; height: 70%;">
                            <span class="display-1 font-weight-bold mt-5" :class="hover ? 'white--text' : 'primary--text'">6</span>
                        </v-row>
                        <v-row no-gutters justify="center" align="center" style="border: 1px dashed red; height: 30%;">
                            <span class="text-uppercase text-center font-weight-bold white--text">compétitions</span>
                        </v-row>
                    </v-col>
                </v-hover>
                <v-hover v-slot:default="{ hover }">
                    <v-col cols="3" :class="hover ? 'primary' : 'black'" style="border: 1px solid orange;">
                        <v-row no-gutters justify="center" align="center" style="border: 1px dashed red; height: 70%;">
                            <span class="display-1 font-weight-bold mt-5" :class="hover ? 'white--text' : 'primary--text'">130</span>
                        </v-row>
                        <v-row no-gutters justify="center" align="center" style="border: 1px dashed red; height: 30%;">
                            <span class="text-uppercase text-center font-weight-bold white--text">équipes</span>
                        </v-row>
                    </v-col>
                </v-hover>
                <v-hover v-slot:default="{ hover }">
                    <v-col cols="3" :class="hover ? 'primary' : 'black'" style="border: 1px solid orange;">
                        <v-row no-gutters justify="center" align="center" style="border: 1px dashed red; height: 70%;">
                            <span class="display-1 font-weight-bold mt-5" :class="hover ? 'white--text' : 'primary--text'">769</span>
                        </v-row>
                        <v-row no-gutters justify="center" align="center" style="border: 1px dashed red; height: 30%;">
                            <span class="text-uppercase text-center font-weight-bold white--text">fans</span>
                        </v-row>
                    </v-col>
                </v-hover>
            </v-row>
            <v-row no-gutters align="center" class="primary" style="height: 20%;">
                <v-col cols="12">
                    <span class="white--text">jeanquark</span>
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="2" class="primary">
            <v-img src="/images/scoremodeLogo.png"></v-img>
        </v-col>
    </v-row>

</template>

<script>
	export default {
		data() {
			return {}
		},
		computed: {}
	}
</script>

<style scoped>
</style>
