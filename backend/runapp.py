import flask
from flask import request, jsonify
from flask_cors import CORS
import json
import requests
import queue
import threading


app = flask.Flask(__name__)
client_ips = []
hostip = '192.168.2.11'
port = 4000

@app.route('/')
def hello():
    return '<h1>Hello, World!</h1>'

def send_ips(client1_ip, client2_ip):
    # Send both IPs to client1 and client2 using their respective connections
    # Replace this with your actual implementation for sending data back to clients
    print(f"Sending IPs to client1: {client1_ip} and client2: {client2_ip}")
    requests.post(f"http://{client1_ip}/", json={'ip': client2_ip})

@app.route('/store_ip', methods=['POST'])
def store_ip():
    client_ip = request.remote_addr
    remote_port = request.environ.get('REMOTE_PORT')
    client_ip = client_ip + ':' + str(remote_port)
    if len(client_ips) == 1:  # Second client
        client1_ip = client_ips[0]
        client_ips.append(client_ip)
        threading.Thread(target=send_ips, args=(client1_ip, client_ip)).start()
        return jsonify({'message': 'IP stored successfully, waiting for another'})
    else:  # First client
        client_ips.append(client_ip)
        return jsonify({'message': 'IP stored successfully, waiting for another'})

if __name__ == '__main__':
    app.run(debug=True, port=port, host=hostip)