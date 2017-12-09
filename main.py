from helpers import *
from flask import request

#api_server = "https://stud-db-api.herokuapp.com"
api_server = "http://127.0.0.1:5000"

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
            return render_template('register.html', user = session['user'])
        else:
            return apology(message = "We are sorry but you do not have a permission to register new users.", title="Permision denied")
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
        nextt = request.args.get('next')
        return render_template("login.html", ne = nextt)

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
        
        return render_template('students/listStudents.html', user = session['user'],orderBy = params['orderBy'], data=response['students'], current = 'students', currentAdd = 'student', orderDirection = request.args.get('order'))
    except:
        raise
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
    
    # Fetch all the professors from the API
    response = None
    try:
        ourUrl = api_server + "/api/classes"

        with urllib.request.urlopen(ourUrl) as url:
            response = json.loads(url.read().decode())

        # Sort the array based on the parameter provided by user
        sortedArray = sortDataOnUnicodeKey(response.get('classes'), params.get('orderBy'))
        
        return render_template('classes/listClasses.html', user = session['user'],orderBy = params['orderBy'], data=response['classes'], current = 'classes', orderDirection = request.args.get('order'), currentAdd = 'class')
    except:
        raise
        return render_template('apology.html', message="We are sorry the API server is down.",title='Server Down')

# Professors table
@app.route('/professors')
@login_required
def professors():
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
        ourUrl = api_server + "/api/professors"

        with urllib.request.urlopen(ourUrl) as url:
            response = json.loads(url.read().decode())

        # Sort the array based on the parameter provided by user
        sortedArray = sortDataOnUnicodeKey(response.get('professors'), params.get('orderBy'))
        
        return render_template('professors/listProfessors.html', user = session['user'],orderBy = params['orderBy'], data=response['professors'], current = 'professors', orderDirection = request.args.get('order'), currentAdd = 'professor')
    except:
        return render_template('apology.html', message="We are sorry the API server is down.",title='Server Down')

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
    ourId = None
    r = None
    
    # Getting the id of the student we should display
    try:
        ourId = request.args.get('id')
    except:
        apology(message="No user specified", title="No user")
    
    # Getting the student's info
    try:
        ourUrl = api_server + "/api/students/getOne?id={}".format(ourId)
        
        with urllib.request.urlopen(ourUrl) as url:
            r = json.loads(url.read().decode())
        
        isMale = True
        if r['student']['surname'][-3:] == "ová":
            isMale = False

        return render_template('students/viewStudent.html', user = session['user'], student=r['student'], isMale = isMale, userPrivilege = session['user']['privilege'])
    except:
        return apology(message="We are sorry the API server is down. Or the ID you provided is non-existent",title='Server Down')

# editStudent
@app.route('/students/editStudent', methods=['GET'])
@login_required
def editStudent():
    if session['user']['privilege'] >= 3:
        ourId = None
        r = None
        
        # Getting the id of the student we should display
        try:
            ourId = request.args.get('id')
        except:
            apology(message="No user specified", title="No user")
        
        # Getting the student's info
        try:
            ourUrl = api_server + "/api/students/getOne?id={}".format(ourId)
            
            with urllib.request.urlopen(ourUrl) as url:
                r = json.loads(url.read().decode())

            isMale = True
            if r['student']['surname'][-3:] == "ová":
                isMale = False

            return render_template('students/editStudent.html', user = session['user'], student=r['student'], server = api_server, isMale = isMale)
        except:
            return apology(message="We are sorry the API server is down.",title='Server Down')
    else:
        return apology(message = "We are sorry but you do not have a permission to edit students.", title="Permision denied")
    



# viewParent
@app.route('/parents/viewParent', methods=['GET'])
@login_required
def viewParent():
    return 'work in progress'

# viewClass
@app.route('/classes/viewClass', methods=['GET'])
@login_required
def viewClass():
    return 'work in progress'


# updateStudentRoute
@app.route('/students/updateStudentRoute', methods = ['POST'])
def updateStudentRoute():
    try:
        url = api_server + "/api/students/update"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'

# updateStudentRoute
@app.route('/students/delete', methods = ['POST'])
def deleteStudentRoute():
    try:
        url = api_server + "/api/students/remove"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'