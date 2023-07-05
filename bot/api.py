import os
from dotenv import load_dotenv
import requests

load_dotenv()
url = os.environ.get('API_URL')
token = os.environ.get('API_TOKEN')

params = {
    'isDiscord': True,
    'token': token
}

session = requests.Session()
session.params = params
session.base_url = url
