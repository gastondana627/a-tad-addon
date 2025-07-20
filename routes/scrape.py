from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import WebDriverException

import json
import os

app = Flask(__name__)

@app.route('/scrape', methods=['POST'])
def scrape_url():
    try:
        data = request.get_json()
        url = data.get('url')
        if not url:
            return jsonify({'error': 'URL missing'}), 400

        # Selenium setup
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        driver = webdriver.Chrome(options=chrome_options)

        driver.get(url)

        # Scrape example data
        page_data = {
            'title': driver.title,
            'url': url,
            'meta_description': driver.find_element('xpath', '//meta[@name="description"]').get_attribute('content')
        }

        driver.quit()

        # Save to JSON file
        output_path = os.path.join(os.path.dirname(__file__), "scraped_data.json")
        with open(output_path, "w") as f:
            json.dump(page_data, f, indent=2)

        return jsonify(page_data)

    except WebDriverException as e:
        return jsonify({'error': f'WebDriver failed: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Scraping error: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True)






    