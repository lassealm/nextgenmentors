from flask import Flask, request, render_template, jsonify
import openai


# API-key
openai.api_key = "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"


# Flask application settings
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
application = app

# Message history
messages = None


# Start page
@app.route("/")
def index():
    return render_template("index.html")


# Clear history
@app.route("/clear")
def clear():
    global messages
    messages = [
        {"role": "system", "content": "Du är en hjälpsam assistent."},
    ]
    print(messages)
    return jsonify({"status": "ok"})


# Request ask a question.
@app.route("/ask", methods = ["POST"])
def request_ask():
    global messages

    # Get question
    q = request.data.decode("utf-8").strip()
    
    # Response
    response = {
        "reply": "Error: no response",
    }

    # No question
    if q in ["?",""]:
        response["reply"] = "Har du ingenting du vill fråga om?"
    # Send question to OpenAI
    else:
        # https://platform.openai.com/docs/guides/chat/chat-vs-completions
        messages.append({"role": "user", "content": q})
        reply = openai.ChatCompletion.create(
            messages = messages,
            model = "gpt-3.5-turbo-0301",
            temperature = 0.5, 
            max_tokens = 600,     
        )
        
        if "choices" in reply and len(reply["choices"]) > 0:
            messages.append(dict(reply["choices"][0]["message"]))
            response["reply"] = reply["choices"][0]["message"]["content"].strip()

        print(messages)
        
    # Return response
    return jsonify(response)


# Starting point
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
