from flask import Flask, flash, redirect, render_template, request, session, url_for, jsonify, make_response, Response
from passlib.hash import pbkdf2_sha256 as sha256
from urllib.parse import urlencode, quote_plus
from sqlalchemy.sql.functions import func
from flask_sqlalchemy import SQLAlchemy
from assets.custom import CustomFlask 
from flask_session import Session
from operator import itemgetter
from tempfile import mkdtemp
from functools import wraps
import urllib.request
import json
from assets.helpers import *


db = SQLAlchemy()
app = CustomFlask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///assets/users.db'
db.init_app(app)

app.config["SESSION_FILE_DIR"] = mkdtemp()
app.secret_key = 'super secret key'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# to login
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('user') is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/register', methods=['POST', 'GET'])
@login_required
def register():
    if request.method == 'GET':
        if session['user']['privilege'] == 5:
            return render_template('register.html')
        else:
            return render_template('apology.html', message = "We are sorry but you don't have a permission to access this site.")
    elif request.method == 'POST':
        # TODO bude treba spravit checking
        print(request.form.get('password'))
        db.engine.execute('INSERT INTO users("username", "hash", "privilege") VALUES(:username, :hashh, :privilege)', {'username' : request.form.get('username'), 'hashh': sha256.hash(request.form.get('password')), 'privilege': request.form.get('privilege')})
        return redirect( url_for('login') )

@app.route('/')
@login_required
def index():
    
    # Store all the parameters from user in one variable
    params = {
        'orderBy': request.args.get('orderBy')
    }
    
    # Set default sorting to id
    if params['orderBy'] is None:
        params['orderBy'] = 'id'
    
    # Fetch all the students from the API
    response = None
    ourUrl = "https://stud-db-api.herokuapp.com/api/students?" + urlencode(params, quote_via=quote_plus)
    print(ourUrl)
    with urllib.request.urlopen(ourUrl) as url:
        response = json.loads(url.read().decode())

    # Sort the array based on the parameter provided by user
    sortedArray = sortIt(response.get('students'), params.get('orderBy'))
    
    return render_template('listStudents.html', userName = session['user']['username'],by = params['orderBy'], ala=response['students'], current = 'students', order = request.args.get('order'))

# index 
@app.route('/login', methods=["POST", "GET"])
def login():
    """Log user in."""
    # forget any user_id
    session.clear()

    # if user reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # ensure username was submitted
        if not request.form.get("username"):
            return redirect(render_template('login.html', message='No usename provided!'))

        # ensure password was submitted
        elif not request.form.get("password"):
            return render_template('login.html', message='No password provided!')

        # query database for username
        rows = db.engine.execute("SELECT * FROM users WHERE username = :username", {'username': request.form.get('username')})

        ourBoy = rows.first()

        # ensure username exists and password is correct
        if not rows or not sha256.verify(request.form.get("password"), ourBoy[2]):
            return render_template('login.html', message='Invalid username of password')

        # remember which user has logged in
        session['user'] = {
            'user_id': ourBoy[0],
            'username': ourBoy[1],
            'privilege': ourBoy[3] 
        }

        # redirect user to home page
        return redirect(url_for("index"))
    else:
        return render_template("login.html")

