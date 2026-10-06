from flask import Flask, request, jsonify
from flask_cors import CORS

from model import analyze_finances


app = Flask(__name__)

CORS(app)


# ==================================
# HOME
# ==================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "message":
            "Finance AI Server is running 🤖",

        "status":
            "success"

    })


# ==================================
# ANALYZE FINANCES
# ==================================

@app.route(
    "/analyze",
    methods=["POST"]
)
def analyze():

    try:

        data = request.get_json()


        if not data:
            return jsonify({
                 "message": "No data received"
             }), 400


        
        data.get("transactions", [])


        result = analyze_finances(
                transactions
            )


        return jsonify(result)


    except Exception as error:

        print(error)


        return jsonify({

            "status":
                "error",

            "message":
                str(error)

        }), 500


# ==================================
# SERVER
# ==================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=6000,

        debug=True

    )