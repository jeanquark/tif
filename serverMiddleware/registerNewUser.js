const express = require('express'),
      bodyParser = require('body-parser'),
      moment = require('moment'),
      admin = require('firebase-admin');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function buildUserObject (payload) {
    let user = {}
    user.id = payload.id,
	user.email = payload.email,
	user.picture = '/images/avatar.png',
    user.username = payload.username ? payload.username : '',
	user.birthdate = payload.birthdate ? payload.birthdate : '',
    user.country = {
        name: payload.country.name ? payload.country.name : '',
        slug: payload.country.slug ? payload.country.slug : ''
    },
    // user.language = {
    //     name: payload.language.name ? payload.language.name : '',
    //     slug: payload.language.slug ? payload.language.slug : ''
    // },
    user.level = {
        value: 1,
        _updated_at: moment().unix()
    },
    user.energy = {
        value: 100,
        _updated_at: moment().unix()
    },
    user.tokens = {
        value: 10,
        _udpated_at: moment().unix()
    },
	user.dollarFan = {
		value: 500,
		_udpated_at: moment().unix()
	},
	user.action = {
		value: 0,
		_udpated_at: moment().unix()
	},
	user.skillStrength = { // Physique
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillEndurance = { // Endurance
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillMental = { // Mental
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillMedical = { // Médical
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillCreativity = { // Artistique
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillAuthority = { // Leadership
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillSpiel = { // Baratin
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillSocial = { // Travail d'équipe
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillPuissance = { // Puissance
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillZen = { // Zenitude
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillSpeed = { // Vitesse
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillGoodManners = { // Savoir-Vivre
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillHumor = { // Humour
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillCharisma = { // Charisme
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillMusical = { // Musical
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillEngineering = { // Ingénierie
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillTechnology = { // Technologie
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillResourcefulness = { // Débrouillardise
		value: 1,
		_udpated_at: moment().unix()
	},
	user.stuffAvatarTete = { // Stuff avatar Tête
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarVisage = { // Stuff avatar Visage
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarLunette = { // Stuff avatar Lunette
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarOreilles = { // Stuff avatar Oreilles
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarCou = { // Stuff avatar Cou
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarHautCorps1 = { // Stuff avatar Haut du corps t-shirt
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarHautCorps2 = { // Stuff avatar Haut du corps pull
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarHautCorps3 = { // Stuff avatar Haut du corps veste
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarPoignet = { // Stuff avatar Poignet (bracelets)
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarBasCorps1 = { // Stuff avatar Slips
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarBasCorps2 = { // Stuff avatar Pantalons/shorts
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarPieds = { // Stuff avatar Pieds
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarAccessoires1 = { // Stuff avatar Accessoires
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarAccessoires2 = { // Stuff avatar Accessoires
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAppartementCoussin1 = { // Stuff Appartement Coussin 1
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAppartementCoussin2 = { // Stuff Appartement Coussin 2
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAppartementCouverture = { // Stuff Appartement Couverture
		value: '',
		_updated_at: moment().unix()
	},
    user.status = {
        value: 'user',
        _updated_at: moment().unix()
    },
    user._created_at = moment().unix(),
    user._updated_at = moment().unix()
    return user
}

function buildUserObjectOAuth (payload) {
    let user = {}
    user.id = payload.uid,
	user.email = payload.email,
	user.picture = '/images/avatar.png',
	user.username = 'tif player',
    user.language = {
        name: '',
        slug: ''
    },
    user.level = {
        value: 1,
        updated_at: moment().unix()
    },
    user.tokens = {
        value: 200,
        udpated_at: moment().unix()
    },
	user.dollarFan = {
		value: 500,
		udpated_at: moment().unix()
	},
	user.action = {
		value: 0,
		udpated_at: moment().unix()
	},
	user.skillStrength = { // Physique
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillEndurance = { // Endurance
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillMental = { // Mental
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillMedical = { // Médical
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillCreativity = { // Artistique
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillAuthority = { // Leadership
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillSpiel = { // Baratin
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillSocial = { // Travail d'équipe
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillPuissance = { // Puissance
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillZen = { // Zenitude
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillSpeed = { // Vitesse
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillGoodManners = { // Savoir-Vivre
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillHumor = { // Humour
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillCharisma = { // Charisme
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillMusical = { // Musical
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillEngineering = { // Ingénierie
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillTechnology = { // Technologie
		value: 1,
		_udpated_at: moment().unix()
	},
	user.skillResourcefulness = { // Débrouillardise
		value: 1,
		_udpated_at: moment().unix()
	},
	user.stuffAvatarTete = { // Stuff avatar Tête
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarVisage = { // Stuff avatar Visage
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarLunette = { // Stuff avatar Lunette
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarOreilles = { // Stuff avatar Oreilles
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarCou = { // Stuff avatar Cou
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarHautCorps1 = { // Stuff avatar Haut du corps t-shirt
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarHautCorps2 = { // Stuff avatar Haut du corps pull
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarHautCorps3 = { // Stuff avatar Haut du corps veste
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarPoignet = { // Stuff avatar Poignet (bracelets)
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarBasCorps1 = { // Stuff avatar Slips
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarBasCorps2 = { // Stuff avatar Pantalons/shorts
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarPieds = { // Stuff avatar Pieds
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarAccessoires1 = { // Stuff avatar Accessoires
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAvatarAccessoires2 = { // Stuff avatar Accessoires
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAppartementCoussin1 = { // Stuff Appartement Coussin 1
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAppartementCoussin2 = { // Stuff Appartement Coussin 2
		value: '',
		_updated_at: moment().unix()
	},
	user.stuffAppartementCouverture = { // Stuff Appartement Couverture
		value: '',
		_updated_at: moment().unix()
	},
    user.status = {
        value: 'user',
        updated_at: moment().unix()
    },
    user._created_at = moment().unix(),
    user._updated_at = moment().unix()
    return user
}

module.exports = app.use(async function (req, res, next) {
    try {
        // console.log('REGISTER NEW USER');
        // console.log('req.body.type: ', req.body.type);
        // console.log('req.body.data: ', req.body.data);

        let newUser = {};
        if (req.body && req.body.data && req.body.type === 'oauth') {
            newUser = buildUserObjectOAuth(req.body.data);
        } else if (req.body && req.body.data && req.body.type === 'form') {
            newUser = buildUserObject(req.body.data);
        }
        // console.log('newUser: ', newUser);
        const userId = newUser.id;
        // console.log('newUserId: ', userId);

        var userRef = admin.database().ref('users').child(userId);

        userRef.set(newUser, function(error) {
            if (error) {
                console.log('User could not be registered.' + error);
            } else {
                // console.log('User was registered successfully.');
            }
        });
        
        res.send(newUser);
    } 
    catch (error) {
        res.status(500).send(`Server error, user could not be registered, ${error}`);
    }
});