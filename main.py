from helpers import *

api_server = "https://stud-db-api.herokuapp.com"
#api_server = "127.0.0.1:5000"

# Index
@app.route('/')
def index():
    return redirect('students')

####################################################
# LOGIN AND REGISTER
####################################################
@app.route('/register', methods=['POST', 'GET'])
@login_required
def register():
    if request.method == 'GET':
        if session['user']['privilege'] == 5:
            return render_template('register.html')
        else:
            return apology(message = "We are sorry but you don't have a permission to access this site.", title="Permision denied")
    elif request.method == 'POST':
        # TODO bude treba spravit checking
        db.engine.execute('INSERT INTO users("username", "hash", "privilege") VALUES(:username, :hashh, :privilege)', {'username' : request.form.get('username'), 'hashh': sha256.hash(request.form.get('password')), 'privilege': request.form.get('privilege')})
        return redirect( url_for('login') )


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

##########################################################
# MAIN TABLES
##########################################################

# Student table
@app.route('/students')
@login_required
def students():
    
    # Store all the parameters from user in one variable
    params = {
        'orderBy': request.args.get('orderBy')
    }
    
    # Set default sorting to id
    if params['orderBy'] is None:
        params['orderBy'] = 'id'
    
    # Fetch all the students from the API
    response = None
    try:
        ourUrl = api_server + "/api/students?" + urlencode(params, quote_via=quote_plus)

        with urllib.request.urlopen(ourUrl) as url:
            response = json.loads(url.read().decode())

        # Sort the array based on the parameter provided by user
        sortedArray = sortDataOnUnicodeKey(response.get('students'), params.get('orderBy'))
        
        return render_template('listStudents.html', userName = session['user']['username'],orderBy = params['orderBy'], data=response['students'], current = 'students', orderDirection = request.args.get('order'))
    except:
        return render_template('apology.html', message="We are sorry the API server is down.",title='Server Down')
        
# Class table
@app.route('/classes')
@login_required
def classes():
    
    # Store all the parameters from user in one variable
    params = {
        'orderBy': request.args.get('orderBy')
    }
    
    # Set default sorting to id
    if params['orderBy'] is None:
        params['orderBy'] = 'id'
    
    # Fetch all the classes from the API
    response = None
    try:
        ourUrl = api_server + "/api/classes?"

        with urllib.request.urlopen(ourUrl) as url:
            response = json.loads(url.read().decode())

        # Sort the array based on the parameter provided by user
        sortedArray = sortDataOnUnicodeKey(response.get('classes'), params.get('orderBy'))
        
        print(response)
        return render_template('listClasses.html', userName = session['user']['username'],orderBy = params['orderBy'], data=response['classes'], current = 'classes', orderDirection = request.args.get('order'))
    except:
        raise
        return render_template('apology.html', message="We are sorry the API server is down.",title='Server Down')

@app.route('/professors')
@login_required
def professors():
    return "work in progress"

@app.route('/parents')
@login_required
def parents():
    return "work in progress"


################################################
# DIPLAY ONE
################################################

# viewStudent
@app.route('/students/viewStudent', methods=['GET'])

@login_required
def viewStudent():
    reJson = request.get_json()
    r = None
    
    # Getting the student's info
    try:
        r = requests.get(
        "{}{}".format(api_server, "/api/students/getOne"),
        params=reJson)
    except:
        return apology(message="We are sorry the API server is down.",title='Server Down')
    
    return render_template('viewStudent.html', userName = session['user']['username'])