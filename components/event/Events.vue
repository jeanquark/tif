<template>
    <div class="resumeMatch">
        <!-- loadedEventsByEvent: {{ loadedEventsByEvent }}<br /><br /> -->

        <!-- <v-layout grid-list-xs row wrap class="tempsFortMargin"> -->
        <v-row class="tempsFortMargin">
            <!-- <v-flex d-flex xs12 sm12 md12 justify-center align-center class="titleResume"> -->
            <v-col justify="center" align="center" class="titleResume">
                <div>
                    Temps forts du match
                </div>
            <!-- </v-flex> -->
            </v-col>
			<!-- <v-flex xs12> -->
            <v-col>
				<!-- <v-layout row wrap v-for="(event, index) in loadedEventsByEvent" :key="index"> -->
                <v-row v-for="(event, index) in loadedEventsByEvent" :key="index">
					<!-- <v-flex xs6 v-if="event.team_id === 551"> -->
                    <v-col v-if="event.team_id === 551">
						<!-- <v-layout> -->
                        <v-row>
							<!-- <v-flex xs6 class="text-xs-right"> -->
                            <v-col class="text-right">
								{{ event.player }}
							<!-- </v-flex> -->
                            </v-col>
    							<!-- <v-flex xs4 class="text-xs-right"> -->
                            <v-col class="text-right">

    								{{ event.type }}
    							<!-- </v-flex> -->
                            </v-col>
    							<!-- <v-flex xs2 class="text-xs-right"> -->
                            <v-col class="text-right">

    								{{ event.elapsed }}
    							<!-- </v-flex> -->
                            </v-col>
						<!-- </v-layout> -->
                        </v-row>
					<!-- </v-flex> -->
                    </v-col>
					<!-- <v-flex xs6 offset-xs6 v-if="event.team_id === 630"> -->
                    <v-col v-if="event.team_id === 630">
						<!-- <v-layout> -->
                        <v-row>
							<!-- <v-flex xs2 class="text-xs-left"> -->
                            <v-col class="text-left">
								{{ event.elapsed }}
							<!-- </v-flex> -->
                            </v-col>
    							<!-- <v-flex xs4 class="text-xs-left"> -->
                            <v-col class="text-left">

    								{{ event.type }}
    							<!-- </v-flex> -->
                            </v-col>
    							<!-- <v-flex xs6 class="text-xs-left"> -->
                            <v-col class="text-left">

    								{{ event.player }}
    							<!-- </v-flex> -->
                            </v-col>
						<!-- </v-layout> -->
                        </v-row>
					<!-- </v-flex> -->
                    </v-col>
				<!-- </v-layout> -->
                </v-row>
			<!-- </v-flex> -->
            </v-col>
        <!-- </v-layout> -->
        </v-row>

        <!-- <v-layout grid-list-xs row wrap class="tempsFortMargin">
            <v-flex d-flex xs12 sm12 md12 justify-center align-center class="titleResume">
                <div>
                    Temps forts du match
                </div>
            </v-flex>
            <v-flex d-flex xs12 sm12 md12>
                <v-layout grid-list-xs row wrap class="eventMatch">
                    <v-flex d-flex xs4 sm4 md4 justify-end align-center>
                        <div class="tempsFortGaucheTexte">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center>
                        <div class="tempsfortGaucheImage">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center style="border-right: 1px dashed black">
                        <div class="tempsFortGaucheTime">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteTime">
                            26'
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteImage">
                            <img src="/images/soccer.png" class="imgIconSmall" />
                        </div>
                    </v-flex>
                    <v-flex d-flex xs4 sm4 md4 justify-start align-center>
                        <div class="tempsFortDroiteTexte">
                            Nom Prénom buteur<br />
                            <span style="font-size: 0.9em; font-weight: 500">Nom Prénom passeur</span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex d-flex xs12 sm12 md12>
                <v-layout grid-list-xs row wrap class="eventMatch">
                    <v-flex d-flex xs4 sm4 md4 justify-end align-center>
                        <div class="tempsFortGaucheTexte">
                            Nom Prénom buteur<br />
                            <span style="font-size: 0.9em; font-weight: 500">Nom Prénom passeur</span>
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center>
                        <div class="tempsfortGaucheImage">
                            <img src="/images/soccer.png" class="imgIconSmall" />
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center style="border-right: 1px dashed black">
                        <div class="tempsFortGaucheTime">
                            26'
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteTime">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteImage">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs4 sm4 md4 justify-start align-center>
                        <div class="tempsFortDroiteTexte">
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex d-flex xs12 sm12 md12>
                <v-layout grid-list-xs row wrap class="eventMatch">
                    <v-flex d-flex xs4 sm4 md4 justify-end align-center>
                        <div class="tempsFortGaucheTexte">
                            Carton jaune<br />
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center>
                        <div class="tempsfortGaucheImage">
                            <img src="/images/jaune.png" class="imgIconSmall" />
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center style="border-right: 1px dashed black">
                        <div class="tempsFortGaucheTime">
                            26'
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteTime">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteImage">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs4 sm4 md4 justify-start align-center>
                        <div class="tempsFortDroiteTexte">
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex d-flex xs12 sm12 md12>
                <v-layout grid-list-xs row wrap class="eventMatch">
                    <v-flex d-flex xs4 sm4 md4 justify-end align-center>
                        <div class="tempsFortGaucheTexte">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center>
                        <div class="tempsfortGaucheImage">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center style="border-right: 1px dashed black">
                        <div class="tempsFortGaucheTime">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteTime">
                            26'
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteImage">
                            <img src="/images/rouge.png" class="imgIconSmall" />
                        </div>
                    </v-flex>
                    <v-flex d-flex xs4 sm4 md4 justify-start align-center>
                        <div class="tempsFortDroiteTexte">
                            Carton rouge<br />
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex d-flex xs12 sm12 md12>
                <v-layout grid-list-xs row wrap class="eventMatch">
                    <v-flex d-flex xs4 sm4 md4 justify-end align-center>
                        <div class="tempsFortGaucheTexte">
                            Nom Prénom qui entre<br />
                            <span style="font-size: 0.9em; font-weight: 500">Nom Prénom qui sort</span>
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center>
                        <div class="tempsfortGaucheImage">
                            <img src="/images/fleche.png" class="imgIconSmall" />
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center style="border-right: 1px dashed black">
                        <div class="tempsFortGaucheTime">
                            26'
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteTime">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteImage">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs4 sm4 md4 justify-start align-center>
                        <div class="tempsFortDroiteTexte">
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex d-flex xs12 sm12 md12>
                <v-layout grid-list-xs row wrap class="eventMatch">
                    <v-flex d-flex xs4 sm4 md4 justify-end align-center>
                        <div class="tempsFortGaucheTexte">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center>
                        <div class="tempsfortGaucheImage">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center style="border-right: 1px dashed black">
                        <div class="tempsFortGaucheTime">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteTime">
                            26'
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteImage">
                            <img src="/images/fleche.png" class="imgIconSmall" />
                        </div>
                    </v-flex>
                    <v-flex d-flex xs4 sm4 md4 justify-start align-center>
                        <div class="tempsFortDroiteTexte">
                            Nom Prénom qui entre<br />
                            <span style="font-size: 0.9em; font-weight: 500">Nom Prénom qui sort</span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex d-flex xs12 sm12 md12>
                <v-layout grid-list-xs row wrap class="eventMatch">
                    <v-flex d-flex xs4 sm4 md4 justify-end align-center>
                        <div class="tempsFortGaucheTexte">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center>
                        <div class="tempsfortGaucheImage">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center style="border-right: 1px dashed black">
                        <div class="tempsFortGaucheTime">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteTime">
                            26'
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteImage">
                            <img src="/images/soccer.png" class="imgIconSmall" />
                        </div>
                    </v-flex>
                    <v-flex d-flex xs4 sm4 md4 justify-start align-center>
                        <div class="tempsFortDroiteTexte">
                            Nom Prénom buteur<br />
                            <span style="font-size: 0.9em; font-weight: 500">Nom Prénom passeur</span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex d-flex xs12 sm12 md12>
                <v-layout grid-list-xs row wrap class="eventMatch">
                    <v-flex d-flex xs4 sm4 md4 justify-end align-center>
                        <div class="tempsFortGaucheTexte">
                            Nom Prénom buteur<br />
                            <span style="font-size: 0.9em; font-weight: 500">Nom Prénom passeur</span>
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center>
                        <div class="tempsfortGaucheImage">
                            <img src="/images/soccer.png" class="imgIconSmall" />
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-end align-center style="border-right: 1px dashed black">
                        <div class="tempsFortGaucheTime">
                            26'
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteTime">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs1 sm1 md1 justify-start align-center>
                        <div class="tempsFortDroiteImage">
                        </div>
                    </v-flex>
                    <v-flex d-flex xs4 sm4 md4 justify-start align-center>
                        <div class="tempsFortDroiteTexte">
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout> -->
    </div>
</template>

<script>
	export default {
		props: ['eventId'],
		created() {
			this.$store.dispatch('eventEvents/fetchEventsByEvent', this.eventId)
		},
		data() {
			return {}
		},
		computed: {
			loadedUser() {
				return this.$store.getters['users/loadedUser']
			},
			loadedEventsByEvent() {
				return this.$store.getters['eventEvents/loadedEventsByEvent'][this.eventId]
			},
			// loadedEventsHomeTeam() {
			// 	return this.loadedEventsByEvent.filter(event => event.team_id === 551)
			// },
			// loadedEventsVisitorTeam() {
			// 	return this.loadedEventsByEvent.filter(event => event.team_id === 630)
			// }
		}
	}
</script>

<style scoped>
	.resumeMatch {
		background-color: white;
	}
	.titleResume {
		background-color: #fafafa;
		font-size: 1.1em;
		font-weight: 700;
		margin-bottom: 5px;
	}
	.eventMatch {
		background-color: lightgrey;
	}
	.imgIconSmall {
		width: 25px;
	}
	.tempsFortGaucheTexte {
		padding: 10px;
		color: black;
		font-size: 1em;
		text-transform: uppercase;
		text-align: right;
		font-weight: 700;
	}
	.tempsfortGaucheImage {
		padding: 10px;
		text-align: right;
	}
	.tempsFortGaucheTime {
		padding: 10px;
		color: black;
		font-size: 1em;
		text-transform: uppercase;
	}
	.tempsFortDroiteTime {
		padding: 10px;
		color: black;
		font-size: 1em;
		text-transform: uppercase;
	}
	.tempsFortDroiteImage {
		padding: 10px;
		text-align: left;
	}
	.tempsFortDroiteTexte {
		padding: 10px;
		color: black;
		font-size: 1em;
		text-transform: uppercase;
		text-align: left;
		font-weight: 700;
	}
	.menuMatch {
		border-right: 1px solid darkgrey;
		padding: 15px;
		color: orangered;
		font-size: 1.2em;
		text-transform: uppercase;
	}
	.menuTif {
		padding: 15px;
		color: white;
		font-size: 1.2em;
		text-transform: uppercase;
	}
	.tempsFortMargin {
		margin-top: 20px;
	}
</style>