import Firebase from 'firebase';

var db = new Firebase("https://amber-inferno-5019.firebaseIO.com/");

var userID = null;

function createUser(email, password) {
	db.createUser({
		email: email,
		password: password
	}, function (error, userData) {
		if (error) {
			// TODO do
		} else {
			login(email, password);
		}
	});
}

function login(email, password) {
	db.authWithPassword({
		email: email,
		password: password		
	}, function (error, userData) {
		if (error) {
			// TODO do
		} else {
			userID = userData.uid;
		}
	})
}

