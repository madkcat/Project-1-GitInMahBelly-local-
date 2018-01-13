$(function () {
    console.log("ready!");

    // $(window).on('load', function() {



    var webAuth = new auth0.WebAuth({
        domain: 'gitinmahbelly.auth0.com',
        clientID: '5qspVNrbbZasBXNHa5cIz9Q5gsqtHvb6',
        responseType: 'token id_token',
        audience: 'https://gitinmahbelly.auth0.com/userinfo',
        scope: 'openid',
        redirectUri: window.location.href
    });

    // variables for dom buttons
    var loginStatus = $('#status');
    var loginBtn = $('#btnLogin');
    var logoutBtn = $('#btnLogout');

    // onclick event for login
    loginBtn.on('click', function (e) {
        e.preventDefault();
        webAuth.authorize();
    });


    // onclick event for logout
    logoutBtn.on('click', logout);

    function handleAuthentication() {
        webAuth.parseHash(function (err, authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                setSession(authResult);

            } else if (err) {

                console.log(err);
                alert(
                    'Error: ' + err.error + '. Check the console for further details.'
                );
            }
            displayButtons();
        });
    }

    function setSession(authResult) {
        // Set the time that the access token will expire at
        var expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    function logout() {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        displayButtons();
    }

    function isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    // functions to add hide class to buttons
    let loginState = function () {
        btnLogout.classList.remove('hide');
        btnLogin.classList.add('hide');

    };

    let logoutState = function () {
        btnLogout.classList.add('hide');
        btnLogin.classList.remove('hide');

    };

    function displayButtons() {
        if (isAuthenticated()) {
            loginState();
            loginStatus.innerHTML = 'You are logged in!';
        } else {
            logoutState();
            loginStatus.innerHTML =
                'You are not logged in! Please log in to continue.';
        }
    }
    handleAuthentication();
    //   });

});