from helpers import *
from flask import request

api_server = "https://stud-db-api.herokuapp.com"
#api_server = "http://127.0.0.1:5000"

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
        print(sortedArray)
        
        return render_template('students/listStudents.html', user = session['user'],orderBy = params['orderBy'], data=response['students'], current = 'students', currentAdd = {'what':'student','where':url_for('addStudent')}, orderDirection = request.args.get('order'))
    except:
        return render_template('apology.html', message="We are sorry the API server is down.",title='Server Down', user = session['user'])
        
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
        
        
        return render_template('classes/listClasses.html', user = session['user'],orderBy = params['orderBy'], data=response['classes'], current = 'classes', orderDirection = request.args.get('order'), currentAdd = {'what':'class','where':url_for('addClass')})
    except:
        raise
        return render_template('apology.html', message="We are sorry the API server is down.",title='Server Down', user = session['user'])

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
        
        return render_template('professors/listProfessors.html', user = session['user'],orderBy = params['orderBy'], data=response['professors'], current = 'professors', orderDirection = request.args.get('order'), currentAdd = {'what':'professor','where':url_for('addProfessor')})
    except:
        return render_template('apology.html', message="We are sorry the API server is down.",title='Server Down', user = session['user'])

@app.route('/parents')
@login_required
def parents():
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
        ourUrl = api_server + "/api/parents?" + urlencode(params, quote_via=quote_plus)

        with urllib.request.urlopen(ourUrl) as url:
            response = json.loads(url.read().decode())

        # Sort the array based on the parameter provided by user
        sortedArray = sortDataOnUnicodeKey(response.get('parents'), params.get('orderBy'))
        
        return render_template('parents/listParents.html', user = session['user'], orderBy = params['orderBy'], data=response['parents'], current = 'parents', currentAdd = {'what':'parent','where':url_for('addParent')}, orderDirection = request.args.get('order'))
    except:
        raise
        return render_template('apology.html', message="We are sorry the API server is down.",title='Server Down', user = session['user'])


################################################
# DIPLAY ONE
################################################
    

# viewStudent
@app.route('/students/view', methods=['GET'])
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
        if r['student']['surname'][-3:] == "ová" or r['student']['surname'][-3:] == "ova":
            isMale = False

        return render_template('students/viewStudent.html', user = session['user'], student=r['student'], isMale = isMale, userPrivilege = session['user']['privilege'])
    except:
        raise
        return apology(message="We are sorry the API server is down. Or the ID you provided is non-existent",title='Server Down')

# editStudent
@app.route('/students/edit', methods=['GET'])
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
            if r['student']['surname'][-3:] == "ová" or r['student']['surname'][-3:] == "ova":
                isMale = False
            

            return render_template('students/editStudent.html', user = session['user'], student=r['student'], server = api_server, isMale = isMale)
        except:
            raise
            return apology(message="We are sorry the API server is down or the ID specified is wrong.",title='Server Down')
    else:
        return apology(message = "We are sorry but you do not have a permission to edit students.", title="Permision denied")
    

# addStudent
@app.route('/students/add', methods=['GET'])
@login_required
def addStudent():
    if session['user']['privilege'] >= 3:
            return render_template('students/addStudent.html', user = session['user'], server = api_server)
    else:
        return apology(message = "We are sorry but you do not have a permission to add students.", title="Permision denied")

# updateStudentRoute
@app.route('/students/addStudentRoute', methods = ['POST'])
def addStudentRoute():
    try:
        url = api_server + "/api/students/add"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'

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


# viewParent
@app.route('/parents/view', methods=['GET'])
@login_required
def viewParent():
    ourId = None
    r = None
    
    # Getting the id of the student we should display
    try:
        ourId = request.args.get('id')
    except:
        apology(message="No user specified", title="No user")
    
    # Getting the student's info
    try:
        ourUrl = api_server + "/api/parents/getOne?id={}".format(ourId)
        
        with urllib.request.urlopen(ourUrl) as url:
            r = json.loads(url.read().decode())
        
        isMale = True
        if r['parent']['surname'][-3:] == "ová" or r['parent']['surname'][-3:] == "ova":
            isMale = False

        return render_template('parents/viewParent.html', user = session['user'], parent=r['parent'], isMale = isMale, userPrivilege = session['user']['privilege'])
    except:
        raise
        return apology(message="We are sorry the API server is down. Or the ID you provided is non-existent",title='Server Down')

# editStudent
@app.route('/parents/edit', methods=['GET'])
@login_required
def editParent():
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
            ourUrl = api_server + "/api/parents/getOne?id={}".format(ourId)
            
            with urllib.request.urlopen(ourUrl) as url:
                r = json.loads(url.read().decode())

            isMale = True
            if r['parent']['surname'][-3:] == "ová" or r['parent']['surname'][-3:] == "ova":
                isMale = False

            return render_template('parents/editParent.html', user = session['user'], parent=r['parent'], server = api_server, isMale = isMale)
        except:
            return apology(message="We are sorry the API server is down or the ID specified is wrong.",title='Server Down')
    else:
        return apology(message = "We are sorry but you do not have a permission to edit students.", title="Permision denied")

# addStudent
@app.route('/parents/add', methods=['GET'])
@login_required
def addParent():
    if session['user']['privilege'] >= 3:
        return render_template('parents/addParent.html', user = session['user'], server = api_server)
    else:
        return apology(message = "We are sorry but you do not have a permission to add parents.", title="Permision denied")

# updateStudentRoute
@app.route('/parents/addParentRoute', methods = ['POST'])
def addParentRoute():
    try:
        url = api_server + "/api/parents/add"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'

# updateStudentRoute
@app.route('/parents/updateParentRoute', methods = ['POST'])
def updateParentRoute():
    try:
        url = api_server + "/api/parents/update"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'

# updateStudentRoute
@app.route('/parents/delete', methods = ['POST'])
def deleteParentRoute():
    try:
        url = api_server + "/api/parents/remove"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'



#############################################
# Professors
#############################################
# viewProfessor
@app.route('/professors/view', methods=['GET'])
@login_required
def viewProfessor():
    ourId = None
    r = None
    
    # Getting the id of the student we should display
    try:
        ourId = request.args.get('id')
    except:
        apology(message="No user specified", title="No user")
    
    # Getting the student's info
    try:
        ourUrl = api_server + "/api/professors/getOne?id={}".format(ourId)
        
        with urllib.request.urlopen(ourUrl) as url:
            r = json.loads(url.read().decode())
        
        isMale = True
        if r['professor']['surname'][-3:] == "ová" or r['professor']['surname'][-3:] == "ova":
            isMale = False

        return render_template('professors/viewProfessor.html', user = session['user'], professor=r['professor'], isMale = isMale, userPrivilege = session['user']['privilege'])
    except:
        raise
        return apology(message="We are sorry the API server is down. Or the ID you provided is non-existent",title='Server Down')

# editStudent
@app.route('/professors/edit', methods=['GET'])
@login_required
def editProfessor():
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
            ourUrl = api_server + "/api/professors/getOne?id={}".format(ourId)
            
            with urllib.request.urlopen(ourUrl) as url:
                r = json.loads(url.read().decode())

            isMale = True
            if r['professor']['surname'][-3:] == "ová" or r['professor']['surname'][-3:] == "ova":
                isMale = False

            return render_template('professors/editProfessor.html', user = session['user'], professor=r['professor'], server = api_server, isMale = isMale)
        except:
            raise
            return apology(message="We are sorry the API server is down or the ID specified is wrong.",title='Server Down')
    else:
        return apology(message = "We are sorry but you do not have a permission to edit professors.", title="Permision denied")

# addStudent
@app.route('/professors/add', methods=['GET'])
@login_required
def addProfessor():
    if session['user']['privilege'] >= 3:
        return render_template('professors/addProfessor.html', user = session['user'], server = api_server)
    else:
        return apology(message = "We are sorry but you do not have a permission to add professors.", title="Permision denied")

# updateStudentRoute
@app.route('/professors/addProfessorRoute', methods = ['POST'])
def addProfessorRoute():
    try:
        url = api_server + "/api/professors/add"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'

# updateStudentRoute
@app.route('/professors/updateProfessorRoute', methods = ['POST'])
def updateProfessorRoute():
    try:
        url = api_server + "/api/professors/update"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'

# updateStudentRoute
@app.route('/professors/delete', methods = ['POST'])
def deleteProfessorRoute():
    try:
        url = api_server + "/api/professors/remove"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'

#############################################
# Classes
#############################################
# viewClass
@app.route('/classes/view', methods=['GET'])
@login_required
def viewClass():
    ourId = None
    r = None
    
    # Getting the id of the student we should display
    try:
        ourId = request.args.get('id')
    except:
        apology(message="No user specified", title="No user")
    
    # Getting the student's info
    try:
        ourUrl = api_server + "/api/classes/getOne?id={}".format(ourId)
        
        with urllib.request.urlopen(ourUrl) as url:
            r = json.loads(url.read().decode())
        
        sortDataOnUnicodeKey(r['rclass']['pupils'], 'surname')

        return render_template('classes/viewClass.html', user = session['user'], rclass=r['rclass'], userPrivilege = session['user']['privilege'])
    except:
        raise
        return apology(message="We are sorry the API server is down. Or the ID you provided is non-existent",title='Server Down')

# editStudent
@app.route('/classes/edit', methods=['GET'])
@login_required
def editClass():
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
            ourUrl = api_server + "/api/classes/getOne?id={}".format(ourId)
            
            with urllib.request.urlopen(ourUrl) as url:
                r = json.loads(url.read().decode())

            return render_template('classes/editClass.html', user = session['user'], rclass=r['rclass'], server = api_server, userPrivilege = session['user']['privilege'])
        except:
            raise
            return apology(message="We are sorry the API server is down or the ID specified is wrong.",title='Server Down')
    else:
        return apology(message = "We are sorry but you do not have a permission to edit classes.", title="Permision denied")

# addStudent
@app.route('/classes/add', methods=['GET'])
@login_required
def addClass():
    if session['user']['privilege'] >= 3:
        return render_template('classes/addClass.html', user = session['user'], server = api_server, userPrivilege = session['user']['privilege'])
    else:
        return apology(message = "We are sorry but you do not have a permission to add classes.", title="Permision denied")

# updateStudentRoute
@app.route('/classes/addClassRoute', methods = ['POST'])
def addClassRoute():
    try:
        url = api_server + "/api/classes/add"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'

# updateStudentRoute
@app.route('/classes/updateClassRoute', methods = ['POST'])
def updateClassRoute():
    try:
        url = api_server + "/api/classes/update"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'

# updateStudentRoute
@app.route('/classes/delete', methods = ['POST'])
def deleteClassRoute():
    try:
        url = api_server + "/api/classes/remove"
        r = requests.post(url, json=request.get_json())

        return jsonify(r.json())
    except:
        raise
        return 'fail'