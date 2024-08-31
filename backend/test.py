import flask
import requests
from flask import request, jsonify

app = flask.Flask(__name__)
ip = '127.0.0.1'
port = 5000

@app.route('/', methods=['GET'])
def sendrequest():
    # send a request to /finduser
    #response = requests.post('http://'+ip+':'+str(port)+'/finduser')
    return jsonify({'status': 'hi'}), 200

@app.route('/', methods=['POST'])
def getrequest():
    print(request.json)
    return jsonify({'status': 'success'}), 200


if __name__ == '__main__':
    app.run(debug=True, port = 4000, host= '192.168.2.11')