import flask
from flask import request, jsonify
from flask_cors import CORS
import json
import requests
import queue


app = flask.Flask(__name__)
userQueue = queue.Queue()

@app.route('/')
def hello():
    return '<h1>Hello, World!</h1>'

@app.route('/finduser', methods=['POST'])
# put user and ip into queue
def find_user():
    if userQueue.qsize() == 0:
        print(request.remote_addr)
        userQueue.put(request.json, request.remote_addr)
        return jsonify({'status': 'added'}), 200
    else:
        # get current user and the other user and send respective ips to both users
        print(request.remote_addr)
        user1 = request.json['name'], request.remote_addr
        user2 = userQueue.get()
        requests.post('http://'+user1[1]+':4000/', json={'nick': user2[0], 'ip': user2[1]})
        return jsonify({'nick': user2[0], 'ip': user2[1]}), 200





if __name__ == '__main__':
    app.run(debug=True)