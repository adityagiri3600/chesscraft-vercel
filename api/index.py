from io import StringIO
import os
import json
import sys

import google.generativeai as genai
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("	gemini-2.5-flash-lite")

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

@app.route("/ask", methods=["POST"])
def ask():
    piece_one = request.get_json()["piece_one"]
    piece_two = request.get_json()["piece_two"]
    strength = request.get_json()["strength"]
    print(piece_one, piece_two, strength)
    
    system = "you're an ai that lists the valid moves a hypothetical combination of chess pieces can make in the form of (∆x,∆y) in a list. do not output anything else other than the list. also make sure the output is interesting game wise. Output in a json format first arguement is jump moves like a knight or pawn, second is directional moves which can be repeated indefinitely like a bishop or a rook, third is capture which includes the jump and direction moves for capturing, if capture moves are same as normal moves don't pass in the capture move parameter\nexamples:\nwhite pawn : {\n        jump: [[0, 1]],\n        direction: [],\n        capture: {\n          jump: [[1, 1], [-1, 1]]\n        }\n      }\nwhite rook: \n{\n        jump: [],\n        direction: [[1, 0], [-1, 0], [0, 1], [0, -1]]\n      } do not use any formatting like backticks output in plain text!!! most important !! USE PLAIN TEXT DONT OUTPUT IN CODE BLOCK. Also do not make redundant pieces like bishop+queen shouldn't just give another piece that moves like a queen, in such a case you can use novel moves, assymetry or differing capture moves from regular moves to make a unique piece. lastly provide three more fields, 'emoji', 'name' and 'description', emoji should be a SINGLE emoji and suitable and interesting, description should be short and also interesing possibly story like and should describe moves in brief. Emojis should be actual emojis and no other unicode characters (example:🦄,🎠,🏇 are good, ♞ etc is bad) and they must be a singular emoji not two or more. you'll be given one more parameter the strength of combination it'll be between 1-11 the higher it is the stronger the piece is. 1 gives a bad piece, 2-5 really good piece, 6-11 god like very strong piece. do not get confused between jump and direction, jump moves happen once, direction moves are like rays thus much more powerful. one more field will be a string of python code, field name is 'code', (output the string in one line, the python code itself can have multiple lines separated by \n, no imports allowed) that gets executed everytime the piece is played, the python code's scope includes these variables: {piece:{name,moves:{direction[],jump[],capture:{direction[],jump[]}},side:[white|black]},prevx,prevy,x,y,boardIndex,boardState} boardState is an array of 64 pieces dict or empty string.  the code runs by itself so do not use return. This allows for complex and interesting pieces such as a piece that buffs all knights on one's side by giving it stronger moves, or a piece that removes all pieces in a certain radius. You have to change the variables or introduce other variables for anything to happen at all. dont put basic gameplay in the python code, add a new feature. example code : deleting other pieces in radius : 'radius = 2\nfor i in range(-radius, radius + 1):\n    for j in range(-radius, radius + 1):\n        if i == 0 and j == 0:\n            continue\n        new_x = x + i\n        new_y = y + j\n        if 0 <= new_x < 8 and 0 <= new_y < 8:\n            index = new_y * 8 + new_x\n            if boardState[index] != '' and boardState[index]['side'] != self['side']:\n                boardState[index] = '', or for example to allow capturing all knights set boardState[boardIndex]['moves']['capture'] to be the list indices of all kights. you can also keep it simple like boardState[boardIndex-1] = '', killing any piece on its side, only effects in boardState take place, everything else is just for information. All moves should be in the moves field, moves.jump, moves.direction, moves.capture.jump, and moves.capture.direction.IN THE PYTHON CODE ONLY CHANGES IN BOARDSTATE TAKE EFFECT, changing any other variable won't have any effect, so all powers should change the boardState variable somehow"
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
    result_data = json.loads(response)
    if "code" in result_data and result_data["code"] != "":
        result_data["code"] = clean_code(result_data["code"])
    print(result_data)
    result = None
    try:
        result = jsonify(result_data)
    except:
        # try once more
        try:
            response = model.generate_content(system).text
            if response[0] == '`':
                response = response.split("\n")[1:-1]
                response = "\n".join(response)
            if response[-1] == '`':
                response = response.split("\n")[:-1]
                response = "\n".join(response)
            print(response)
            result_data = json.loads(response)
            if "code" in result_data:
                result_data["code"] = clean_code(result_data["code"])
            result = jsonify(result_data)
        except:
            return jsonify({
                "error": "Internal Server Error"
            })
    return result

        
    
    # return jsonify({
    # "jump": [[0, 1], [1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]],
    # "direction": [],
    # "capture": {
    #   "jump": [[1, 1], [-1, 1], [1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
    #     }
    # })

@app.route('/run-python', methods=['POST'])
def run_python():
    variables = request.json.get('variables')
    python_code = request.json.get('code')
    original_stdout = sys.stdout
    sys.stdout = StringIO()  # Capture output

    # Execute the code and capture the output
    try:
        exec(python_code, globals(), variables)
    except Exception as e:
        sys.stdout = original_stdout  # Reset stdout in case of error
        return jsonify({"error": str(e)}), 400
    
    sys.stdout = original_stdout  # Reset stdout
    return jsonify(variables)

# function to clean code
def clean_code(code):
    system = "convert this string to valid python code and do not output anything else "
    system += code
    response = model.generate_content(system).text
    if response[0] == '`':
        response = response.split("\n")[1:-1]
        response = "\n".join(response)
    if response[-1] == '`':
        response = response.split("\n")[:-1]
        response = "\n".join(response)
    return response


if __name__ == "__main__":
    app.run(debug=True)