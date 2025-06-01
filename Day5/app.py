from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__, static_folder='static')

API_KEY = 'your_api_key_here' # replace with your actual API key

def detect_location_type(name):
    name = name.lower()
    districts = ['dang', 'valsad', 'surat', 'navsari', 'ahwa', 'banaskantha', 'aravalli']
    states = ['gujarat', 'maharashtra', 'rajasthan', 'kerala', 'tamil nadu', 'karnataka', 'uttar pradesh']
    countries = ['india', 'usa', 'canada', 'japan', 'uk', 'germany', 'france', 'italy']

    if name in districts:
        return 'District'
    elif name in states:
        return 'State'
    elif name in countries:
        return 'Country'
    else:
        return 'City'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/result')
def result_page():
    return render_template('result.html')

@app.route('/weather', methods=['POST'])
def get_weather():
    data = request.get_json()

    if 'city' in data and data['city']:
        query = f"q={data['city']}"
    elif 'lat' in data and 'lon' in data:
        query = f"lat={data['lat']}&lon={data['lon']}"
    else:
        return jsonify({'error': 'No location data provided'}), 400

    url = f"http://api.openweathermap.org/data/2.5/weather?{query}&appid={API_KEY}&units=metric"

    try:
        res = requests.get(url)
        weather_data = res.json()

        if res.status_code != 200 or 'main' not in weather_data:
            return jsonify({'error': 'City not found'}), 404

        location_type = detect_location_type(weather_data['name'])

        result = {
            'city': weather_data['name'],
            'location_type': location_type,
            'temperature': weather_data['main']['temp'],
            'humidity': weather_data['main']['humidity'],
            'wind_speed': weather_data['wind']['speed'],
            'description': weather_data['weather'][0]['description'],
            'condition_code': weather_data['weather'][0]['id']
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': 'API request failed', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 
