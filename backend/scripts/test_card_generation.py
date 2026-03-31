import ssl
import json
import urllib.request
import urllib.parse
import os

BASE = 'http://localhost:8000'
API_PREFIX = '/api/v1'

# Allow insecure SSL for downloads if needed
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

os.makedirs('backend/fonts', exist_ok=True)

fonts = {
    'Inter-Bold.ttf': 'https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf',
    'Inter-Regular.ttf': 'https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf'
}

for name, url in fonts.items():
    dest = os.path.join('backend', 'fonts', name)
    if not os.path.exists(dest):
        try:
            print(f'Downloading {name}...')
            urllib.request.urlretrieve(url, dest)
            print('Saved to', dest)
        except Exception as e:
            print('Failed to download', url, e)

# Login
login_url = BASE + API_PREFIX + '/auth/login/'
creds = {'username': 'renaneliakim2@gmail.com', 'password': '12345678'}
data = json.dumps(creds).encode('utf-8')
req = urllib.request.Request(login_url, data=data, headers={'Content-Type':'application/json'})
try:
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        resp_data = json.load(resp)
        access = resp_data.get('access')
        print('Access token retrieved')
except Exception as e:
    print('Login failed:', e)
    raise SystemExit(1)

# Get user basic info
me_url = BASE + API_PREFIX + '/users/me/basic/'
req = urllib.request.Request(me_url, headers={'Authorization': f'Bearer {access}'})
with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
    me = json.load(resp)
    uid = me.get('id')
    print('User id:', uid)

# Fetch card PNG
card_url = BASE + API_PREFIX + f'/users/{uid}/card.png'
req = urllib.request.Request(card_url, headers={'Authorization': f'Bearer {access}'})
with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
    data = resp.read()
    with open('backend/profile_card.png', 'wb') as f:
        f.write(data)
    print('Saved backend/profile_card.png')

print('Done')
