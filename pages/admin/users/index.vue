<template>
	<div>
		<!-- loadedUsers: {{ loadedUsers }}<br /><br /> -->
		<!-- user: {{ user }}<br /><br /> -->
		<v-breadcrumbs :items="links">
            <template v-slot:item="props">
                <v-breadcrumbs-item :to="props.item.to" nuxt exact :disabled="props.item.disabled">
                    {{ props.item.text }}
                </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>
	  	<v-flex xs12 sm10 offset-sm1>
	  		<br /><br />
	      	<h1 class="text-md-center">Users</h1>
	      	<br /><br />
	      	<!-- <v-btn color="primary" dark slot="activator" class="mb-2" to="/admin/events/create">Add a User</v-btn> -->
			<v-card>
			    <v-card-title>
                    <div class="flex-grow-1"></div>
			    	<v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
			    </v-card-title>

			    <v-data-table :headers="headers" :items="loadedUsers" :items-per-page="5" :search="search" class="elevation-1">
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.username }}</td>
                                <td>{{ item.email }}</td>
                                <td>{{ item.level ? item.level.value : 'undefined' }}</td>
                                <td>{{ item.status ? item.status.value : 'undefined' }}</td>
                                <td>{{ item._updated_at | moment('from', 'now') }}</td>
                                <td style="white-space: nowrap;">
									<v-btn color="info" small class="" @click="updateUserAccount(item, 'userToAdmin')" v-if="item.status && item.status.value != 'admin'">
										Grant Admin privileges&nbsp;&nbsp;
										<font-awesome-icon :icon="['fas', 'user']" />
									</v-btn>
									<v-btn color="warning" small @click="updateUserAccount(item, 'adminToUser')" v-if="item.status && item.status.value != 'user'">
										Revoke Admin privileges&nbsp;&nbsp;
										<font-awesome-icon :icon="['fas', 'user-slash']" class="icon" />
									</v-btn>
									<!-- <v-btn icon class="mx-0" disabled @click="editUser(item)">
										<v-icon color="teal">mdi-pencil</v-icon>
									</v-btn> -->
								</td>
								<td>
									<v-btn icon class="mx-0" @click.stop="openDialogDeleteUser(item)">
										<v-icon color="pink">mdi-delete</v-icon>
									</v-btn>
								</td>
                            </tr>
                        </tbody>
                    </template>
                </v-data-table>

			    
			</v-card>
	    </v-flex>




	    <v-dialog
				v-model="dialogDeleteUser"
				width="500px"
			>
				<v-card>
					<v-card-title
						class="primary white--text"
						primary-title
					>
						Are you sure?
					</v-card-title>

					<v-card-text class="py-2">
						Deleting a user will suppress all occurences of the user in the database (teams, subscriptions, etc.). This action is not reversible.
						<v-text-field
							v-model="userEmail"
							label="Please type user email address"
							prepend-icon="mdi-email"
							class="my-2"
						></v-text-field>
					</v-card-text>

					<v-divider></v-divider>

					<v-card-actions>
						<v-layout justify-center>
							<v-btn
								color="error"
								:text="false"
								:disabled="disabled"
								:loading="loading"
								@click.stop="deleteUser(user.id)"
							>
								Delete user
							</v-btn>
						</v-layout>
					</v-card-actions>
				</v-card>
			</v-dialog>


	</div>
</template>

<script>
	import Noty from 'noty'
  export default {
    layout: 'layoutBack',
    created () {
    	this.$store.dispatch('users/fetchUsers')
    },
    data () {
    	return {
	        search: '',
	        headers: [
	        	{
	        		text: 'N°',
	        		value: 'id',
	        		sortable: false
	        	},
	        	{
		       		text: 'Username',
		            align: 'left',
		            sortable: false,
		            value: 'username'
		        },
		        { text: 'E-mail', value: 'email' },
		        { text: 'Niveau', value: 'level.value' },
				{ text: 'Statut', value: 'status.value' },
				{ text: 'Date de création', value: '_created_at' },
				{ text: 'Privileges', sortable: true },
				{ text: 'Actions', sortable: false }
	        ],
	        links: [
	        	{
	        		text: 'Dashboard',
	        		to: '/admin',
	        		disabled: false
	        	},
	        	{
	        		text: 'Users',
	        		to: '/admin/users',
	        		disabled: true

	        	}
	        ],
	        dialogDeleteUser: false,
	        user: '',
	        userEmail: ''
    	}
    },
    computed: {
    	loading () {
    		return this.$store.getters['loading']
    	},
    	loadedUsers () {
	    	return this.$store.getters['users/loadedUsers']
    	},
    	disabled () {
			return this.userEmail !== this.user.email
		},
    },
    methods: {
   //  	async updateUserAccount(user, action) {
   //  		// console.log('user: ', user)
   //  		this.selectedRow = user.email
   //  		this.$store.dispatch('users/updateUserAccount', {user, action}).then(() => {
   //  			this.selectedRow = ''
   //  		}).catch(error => {
 		// 		console.log('error: ', error)
   //  			this.selectedRow = ''
			// })
   //  	},
    	async updateUserAccount(user, action) {
    		try {
	    		// this.selectedRow = user.email
	    		await this.$store.dispatch('users/updateUserAccount', { user, action })
	    		// this.selectedRow = ''
	    	} catch (error) {
	    		console.log('error: ', error)
	    		// this.selectedRow = ''
	    	}
    	},
        checkUserCustomClaim () {
        	this.$store.dispatch('users/checkUserCustomClaim')
        },
        openDialogDeleteUser (user) {
        	this.dialogDeleteUser = true
        	this.user = user
        },
        async deleteUser (userId) {
        	try {
        		this.$store.commit('setLoading', true)
        		await this.$store.dispatch('users/deleteUser', { userId })
        		this.$store.commit('setLoading', false)
        		new Noty({
        			type: 'success',
        			text: 'Successfully deleted user.',
        			timeout: 5000,
        			theme: 'metroui'
        		}).show()
        	} catch (error) {
        		// console.log('error from vue method: ', error)
        		this.$store.commit('setLoading', false)
        		new Noty({
        			type: 'error',
        			text: 'Sorry, an error occured and the user could not be deleted.',
        			timeout: 5000,
        			theme: 'metroui'
        		}).show()
        	}
        }
    }
  }
</script>