from flask import Flask, request, jsonify,send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app,origins="*")

# SQLite Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contacts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
client_folder = os.path.join(os.getcwd(),"..","client")
dist_folder = os.path.join(client_folder,"dist")

# Contact model
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)

# Create the database
with app.app_context():
    db.create_all()

@app.route("/",defaults={"filename":""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(dist_folder,filename)

@app.route('/submit', methods=['POST'])
def submit_form():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    # Server-side validation
    errors = {}
    if not name or len(name) < 5:
        errors['name'] = 'Name must be at least 5 characters long.'
    if not email or '@' not in email:
        errors['email'] = 'Invalid email format.'
    if not message or len(message) < 10:
        errors['message'] = 'Message should be more than 10 characters.'
    if not message or len(message) > 300:
        errors['message'] = 'Message cannot be more than 300 characters.'

    # If errors exist, return a 400 status with errors
    if errors:
        return jsonify({'errors': errors}), 400
    
    new_contact = Contact(name=name, email=email, message=message)
    db.session.add(new_contact)
    db.session.commit()

    return jsonify({'message': 'Form submitted successfully!'}), 200

if __name__ == '__main__':
    app.run(debug=True)
