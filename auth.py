from requests_oauthlib import OAuth2Session
from flask import Flask, request, redirect, session, url_for
from flask.json import jsonify
import os,json

app = Flask(__name__)

google_client_id = "822911843488-cl7uglc2o4rdc7j5gmj78vhsuckt33be.apps.googleusercontent.com"
google_client_secret = "1OKWwHPrKejo408qNTU3EyD9"
google_authorization_base_url = "https://accounts.google.com/o/oauth2/v2/auth"
google_token_url = "https://www.googleapis.com/oauth2/v4/token"
google_redirect_uri = "https://127.0.0.1:5000/googlecallback"
scope = ["https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile"]

git_client_id = "507ea9b61b91104a1c2e"
git_client_secret = "80033eb98accf7582a92dbe9367849092cddf592"
git_authorization_base_url = 'https://github.com/login/oauth/authorize'
git_token_url = 'https://github.com/login/oauth/access_token'


@app.route("/")
def home():
    return '<a class="button" href="/google">Google Login</a><br><a class="button" href="/github">Github Login</a><br><a class="button" href="/facebook">Facebook Login</a>'


@app.route("/google")
def google():
    
    google = OAuth2Session(google_client_id, scope=scope, redirect_uri=google_redirect_uri)
    google_authorization_url, state = google.authorization_url(google_authorization_base_url)

    session['oauth_state'] = state
    return redirect(google_authorization_url)

@app.route("/github")
def github():
    """Step 1: User Authorization.

    Redirect the user/resource owner to the OAuth provider (i.e. Github)
    using an URL with a few key OAuth parameters.
    """
    
    github = OAuth2Session(git_client_id)
    git_authorization_url, state = github.authorization_url(git_authorization_base_url)

    session['oauth_state'] = state
    return redirect(git_authorization_url)


@app.route("/gitcallback", methods=["GET"])
def gitcallback():
    

    github = OAuth2Session(git_client_id, state=session['oauth_state'])
    token = github.fetch_token(git_token_url, client_secret=git_client_secret,
                               authorization_response=request.url)


    session['oauth_token'] = token

    return redirect(url_for('gitprofile'))



@app.route("/googlecallback", methods=["GET"])
def googlecallback():
    
    google = OAuth2Session(google_client_id, redirect_uri=google_redirect_uri,state=session['oauth_state'])
    token = google.fetch_token(google_token_url, client_secret=google_client_secret,
                               authorization_response=request.url)

    session['oauth_token'] = token
    return redirect(url_for('googleprofile'))


@app.route("/googleprofile")
def googleprofile():

    google = OAuth2Session(google_client_id, redirect_uri=google_redirect_uri, token=session['oauth_token'])
    r = google.get('https://www.googleapis.com/oauth2/v1/userinfo')
    print(type(r.content)) 

    return jsonify(r.json())


@app.route("/profile", methods=["GET"])
def gitprofile():
    
    github = OAuth2Session(git_client_id, token=session['oauth_token'])
    return jsonify(github.get('https://api.github.com/user').json())

if __name__ == "__main__":

    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = "1"

    app.secret_key = os.urandom(24)
    app.run(debug=True,ssl_context="adhoc")