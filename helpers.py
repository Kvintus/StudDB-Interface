from flask import Flask, flash, redirect, render_template, session, url_for, jsonify, make_response, Response, jsonify
from flask import request
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
import requests
import json
import icu
import sys



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

def sortDataOnUnicodeKey(arrayToSort, key):
    """Sorts an array by the parameter specified"""

    collator = icu.Collator.createInstance(icu.Locale('sk_SK.UTF-8'))
    if key == 'id':
        return arrayToSort.sort(key=itemgetter('id'))
    elif key == 'name':
        return arrayToSort.sort(key=lambda x: collator.getSortKey(x['name']))
    elif key == 'surname':
        return arrayToSort.sort(key=lambda x: collator.getSortKey(x['surname']))
    elif key == 'start':
        return arrayToSort.sort(key=itemgetter('start'))
    elif key == 'room':
        return arrayToSort.sort(key=lambda x: collator.getSortKey(x['room']))
    else:
        return -1

def apology(message='Error', title='Error'):
    return render_template('apology.html', message=message, title=title)