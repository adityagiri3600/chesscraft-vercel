import os
import json

import google.generativeai as genai
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash-lite")

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

@app.route('/')
@app.route('/<path:path>')
def serve_react(path='index.html'):
    try:
        return send_from_directory(app.static_folder, path)
    except Exception:
        return send_from_directory(app.static_folder, 'index.html')

cache = {}

@app.route("/ask", methods=["POST"])
def ask():
    piece_one = request.get_json()["piece_one"]
    piece_two = request.get_json()["piece_two"]
    strength = request.get_json()["strength"]
    print(piece_one, piece_two, strength)
    cache_key = piece_one + "+" + piece_two + "+" + str(strength)
    if cache_key in cache:
        return jsonify(cache[cache_key])
    
    system = "you're an ai that lists the valid moves a hypothetical combination of chess pieces can make in the form of (∆x,∆y) in a list. do not output anything else other than the list. also make sure the output is interesting game wise. Output in a json format first arguement is jump moves like a knight or pawn, second is directional moves which can be repeated indefinitely like a bishop or a rook, third is capture which includes the jump and direction moves for capturing, if capture moves are same as normal moves don't pass in the capture move parameter\nexamples:\nwhite pawn : {\n        jump: [[0, 1]],\n        direction: [],\n        capture: {\n          jump: [[1, 1], [-1, 1]]\n        }\n      }\nwhite rook: \n{\n        jump: [],\n        direction: [[1, 0], [-1, 0], [0, 1], [0, -1]]\n      } do not use any formatting like backticks output in plain text!!! most important !! USE PLAIN TEXT DONT OUTPUT IN CODE BLOCK. Also do not make redundant pieces like bishop+queen shouldn't just give another piece that moves like a queen, in such a case you can use novel moves, assymetry or differing capture moves from regular moves to make a unique piece. lastly provide three more fields, 'emoji', 'name' and 'description', emoji should be a SINGLE emoji and suitable and interesting, description should be short and also interesing possibly story like and should describe moves in brief. Emojis should be actual emojis and no other unicode characters (example:🦄,🎠,🏇 are good, ♞ etc is bad) and they must be a singular emoji not two or more. you'll be given one more parameter the strength of combination it'll be between 1-11 the higher it is the stronger the piece is. 1 gives a bad piece, 2-5 really good piece, 6-11 god like very strong piece. do not get confused between jump and direction, jump moves happen once, direction moves are like rays thus much more powerful"
    system += "\nyour task: combine " + piece_one + "+" + piece_two + " with strength " + str(strength)
    response = model.generate_content(system).text
    if response[0] == '`':
        # remove first and last lines
        response = response.split("\n")[1:-1]
        response = "\n".join(response)
    if response[-1] == '`':
        response = response.split("\n")[:-1]
        response = "\n".join(response)
    print(response)
    cache[cache_key] = json.loads(response)
    try:
        return jsonify(json.loads(response))
    except:
        # try once more
        try:
            response = model.generate_content(system).text
            if response[0] == '`':
                response = response.split("\n")[1:-1]
                response = "\n".join(response)
            print(response)
            cache[cache_key] = json.loads(response)
            return jsonify(json.loads(response))
        except:
            return jsonify({
                "error": "Internal Server Error"
            })

        
    
    # return jsonify({
    # "jump": [[0, 1], [1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]],
    # "direction": [],
    # "capture": {
    #   "jump": [[1, 1], [-1, 1], [1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
    #     }
    # })

if __name__ == "__main__":
    app.run(debug=True)