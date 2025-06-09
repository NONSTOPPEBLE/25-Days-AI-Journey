import os
import re
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index.html')

@app.route('/api/ai_command', methods=['POST'])
def handle_ai_command():
    """
    Handles AI commands from the frontend.
    These functions are simulated for demonstration purposes.
    """
    data = request.json
    command = data.get('command', '').lower().strip()
    args = data.get('arguments', '').strip()

    print(f"Received command: {command}, arguments: '{args}'") # For debugging in Replit console

    response_text = "ERROR: Unknown command or missing arguments. Type /help for assistance."
    response_class = "error"

    if command.startswith('/'):
        if command == "/summarize":
            if args:
                # Simulated summarization based on input length
                summary_length = min(len(args) // 3, 100) # Max 100 chars
                simulated_summary = f"**[AI Summary]**: After processing, key points identified from your input:\n'{args[:summary_length]}...' (Full text length: {len(args)} characters). Focus on key entities and relationships."
                response_text = simulated_summary
                response_class = "info"
            else:
                response_text = "ERROR: Summarization requires text arguments. Usage: /summarize [your text here]"
                response_class = "error"

        elif command == "/translate":
            if args:
                # Regex to extract language pair (e.g., en-es) and text
                # Matches "xx-yy text" pattern
                lang_match = re.match(r"^([a-z]{2})-([a-z]{2})\s(.+)", args, re.IGNORECASE)
                if lang_match:
                    source_lang = lang_match.group(1).upper()
                    target_lang = lang_match.group(2).upper()
                    text_to_translate = lang_match.group(3)
                    if text_to_translate:
                        response_text = f"**[AI Translation]**: Translating from {source_lang} to {target_lang}:\n'{text_to_translate}' -> '[Simulated translation in {target_lang} for \"{text_to_translate}\"]'"
                        response_class = "info"
                    else:
                        response_text = "ERROR: Translation requires text to translate. Usage: /translate en-es Hello world"
                        response_class = "error"
                else:
                    response_text = "ERROR: Invalid /translate format. Usage: /translate en-es Hello world"
                    response_class = "error"
            else:
                response_text = "ERROR: Translation requires language pair and text. Usage: /translate en-es Hello world"
                response_class = "error"

        elif command == "/analyze":
            if args:
                # Simulated data analysis
                analysis_results = []
                if "sales" in args.lower():
                    analysis_results.append("- Detected 'sales' data. Suggesting trend analysis and revenue forecasting models.")
                if "network" in args.lower() or "traffic" in args.lower():
                    analysis_results.append("- Detected 'network' or 'traffic' data. Recommending anomaly detection and bandwidth utilization assessment.")
                if not analysis_results:
                    analysis_results.append("- Generic data input received. Initiating broad-spectrum pattern recognition.")

                response_text = f"**[AI Analysis]**: Processing input data: '{args}'.\nInitial Scan Complete. Findings:\n" + "\n".join(analysis_results) + "\nRecommendation: Prepare for deep learning model application."
                response_class = "info"
            else:
                response_text = "ERROR: Analysis requires data arguments. Usage: /analyze [data/keywords]"
                response_class = "error"

        elif command == "/diagnose":
            if args:
                # Simulated system diagnosis
                diagnosis_results = {
                    "network": "Network subsystem diagnostics complete. All routing protocols nominal. Minor latency fluctuations detected (0.5%).",
                    "power": "Power regulation unit online. Energy distribution nominal. Suggesting a power cycle every 90 cycles.",
                    "security": "Security protocols active. No anomalies detected in recent logs. Firewall integrity at 99.8%.",
                    "storage": "Data storage arrays nominal. Sector integrity 100%. Free space: 85%."
                }
                module = args.lower().strip()
                if module in diagnosis_results:
                    response_text = f"**[AI Diagnosis]**: Initiating diagnostic scan for '{module}' module.\nResult: {diagnosis_results[module]}"
                    response_class = "info"
                else:
                    response_text = f"ERROR: Unknown module for diagnosis. Available modules: {', '.join(diagnosis_results.keys())}. Usage: /diagnose [module]"
                    response_class = "error"
            else:
                response_text = "ERROR: Diagnosis requires a module name. Usage: /diagnose [module]"
                response_class = "error"

        elif command == "/visualize":
            if args:
                # Simulated data visualization
                visualization_types = {
                    "bar": "Generating textual bar chart. Bars represent value distribution. Max value: 100.",
                    "line": "Rendering ASCII line graph. Showing data trends over simulated time. X-axis: Time, Y-axis: Value.",
                    "network": "Mapping network topology. Identifying nodes and connections. Critical paths highlighted in red.",
                    "pie": "Creating simple textual pie chart. Represents proportions of categories."
                }
                vis_type = args.lower().strip()
                if vis_type in visualization_types:
                    response_text = f"**[AI Visualization]**: Request received for a '{vis_type}' visualization. \n{visualization_types[vis_type]}\nSimulated output data rendering complete."
                    response_class = "info"
                else:
                    response_text = f"ERROR: Unknown visualization type. Available types: {', '.join(visualization_types.keys())}. Usage: /visualize [type]"
                    response_class = "error"

        elif command == "/status":
            response_text = "**[SYSTEM STATUS]**: All core AI modules are **OPERATIONAL**.\n  - **Summarization**: Active (Simulated)\n  - **Translation**: Active (Simulated)\n  - **Analysis**: Active (Simulated)\n  - **Diagnosis**: Active (Simulated)\n  - **Visualization**: Active (Simulated)\n  - **Network**: Stable, Latency to external (simulated) 20ms."
            response_class = "info"

        elif command == "/ping":
            # Simulated network latency test
            response_text = "**[NETWORK PING]**: Initiating connection test to AI core...\n  - Packet 1: 15ms\n  - Packet 2: 18ms\n  - Packet 3: 16ms\nAverage Latency: 16.3ms. Connection stable."
            response_class = "info"

        elif command == "/help":
            response_text = """**INITIATING HELP PROTOCOL...**

**Backend-Processed Commands (Simulated AI Capabilities):**
  - <span class="prompt">/summarize [text]</span>
    - **Purpose**: To condense large bodies of text into key insights.
    - **Usage**: Type `/summarize` followed by the text you wish to summarize.
    - **Example**: `/summarize The quick brown fox jumps over the lazy dog. This is a classic pangram.`
    - **Simulated Output**: Identifies key phrases and overall theme.

  - <span class="prompt">/translate [source-target] [text]</span>
    - **Purpose**: To convert text between specified languages.
    - **Usage**: Type `/translate` followed by a language pair (e.g., `en-es` for English to Spanish) and then the text.
    - **Example**: `/translate en-fr Hello world, how are you?`
    - **Simulated Output**: Provides a placeholder translation in the target language.

  - <span class="prompt">/analyze [data/keywords]</span>
    - **Purpose**: To process input data, identify patterns, anomalies, and relationships.
    - **Usage**: Type `/analyze` followed by data snippets, keywords, or descriptions of data.
    - **Example**: `/analyze sales data from Q3 2024 showing decline`
    - **Simulated Output**: Highlights potential trends and suggests further actions.

  - <span class="prompt">/diagnose [module]</span>
    - **Purpose**: To perform diagnostic checks on specified system modules or components.
    - **Usage**: Type `/diagnose` followed by the module name. Available modules: `network`, `power`, `security`, `storage`.
    - **Example**: `/diagnose network`
    - **Simulated Output**: Reports on the status and health of the specified module.

  - <span class="prompt">/visualize [type]</span>
    - **Purpose**: To generate textual representations of data visualizations.
    - **Usage**: Type `/visualize` followed by the desired visualization type. Available types: `bar`, `line`, `network`, `pie`.
    - **Example**: `/visualize bar`
    - **Simulated Output**: Describes the type of visualization and its conceptual elements.

  - <span class="prompt">/status</span>
    - **Purpose**: To display the current operational status of the core AI modules.
    - **Usage**: Simply type `/status`.
    - **Simulated Output**: Shows if modules are active and general system health.

  - <span class="prompt">/ping</span>
    - **Purpose**: To test network connectivity and latency to the AI core.
    - **Usage**: Simply type `/ping`.
    - **Simulated Output**: Provides simulated response times and connection stability.

**Client-Side Commands (Processed directly in your browser):**
  - <span class="prompt">/echo [text]</span>
    - **Purpose**: Repeats the input text back to the console. Useful for testing input.
    - **Usage**: `/echo This is a test message.`
  - <span class="prompt">/clear</span>
    - **Purpose**: Clears all previous output from the console buffer.
    - **Usage**: `/clear`
  - <span class="prompt">/clear_history</span>
    - **Purpose**: Clears the command history, preventing previous commands from appearing with ArrowUp/Down.
    - **Usage**: `/clear_history`

**END HELP PROTOCOL.**"""
            response_class = "info"

        else:
            # If command is not recognized by backend
            response_text = f"ERROR: Command '{command}' not recognized by backend. Type /help."
            response_class = "error"
    else:
        response_text = "ERROR: Invalid command format. Commands must start with '/'. Type /help."
        response_class = "error"

    return jsonify({
        'output': response_text,
        'class': response_class
    })

if __name__ == '__main__':
    # Get port from environment variable, or default to 5000
    # Replit typically uses PORT environment variable for web apps
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True) # debug=True is useful for development