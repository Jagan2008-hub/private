import subprocess
import urllib.request
import json
import time
import os
import websocket

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
port = 9222
cmd = [
    chrome_path,
    '--headless=new',
    f'--remote-debugging-port={port}',
    '--remote-allow-origins=*',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:8080/'
]

print("Launching Chrome headless with CDP...")
proc = subprocess.Popen(cmd)
time.sleep(2)

ws = None
try:
    resp = urllib.request.urlopen(f'http://localhost:{port}/json')
    pages = json.loads(resp.read().decode())
    # find page for localhost
    ws_url = None
    for p in pages:
        if '8080' in p.get('url', ''):
            ws_url = p['webSocketDebuggerUrl']
            break
    if not ws_url:
        ws_url = pages[0]['webSocketDebuggerUrl']

    print(f"Connecting to CDP WebSocket: {ws_url}")
    ws = websocket.create_connection(ws_url)

    state = {'msg_id': 0}
    def send_cdp(method, params=None):
        state['msg_id'] += 1
        payload = {"id": state['msg_id'], "method": method}
        if params:
            payload["params"] = params
        ws.send(json.dumps(payload))
        while True:
            res = json.loads(ws.recv())
            if res.get("id") == state['msg_id']:
                return res.get("result", {})

    send_cdp("Page.enable")
    send_cdp("DOM.enable")

    def eval_js(expr):
        res = send_cdp("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        return res.get("result", {}).get("value")

    time.sleep(1)

    # 1. Unlock Gate with 9226
    print("\n1. Entering password '9226'...")
    eval_js("document.getElementById('pass-input').value = '9226';")
    eval_js("document.getElementById('gate-form').dispatchEvent(new Event('submit'));")
    time.sleep(1)

    scene_1_hidden = eval_js("document.getElementById('scene-1').classList.contains('hidden')")
    print(f"   Scene 1 hidden: {scene_1_hidden}")

    # 2. Traverse Scenes & Inspect Images
    scenes_buttons = [
        'btn-scene-2',
        'btn-scene-3',
        'btn-scene-4',
        'btn-scene-5',
        'btn-scene-6',
        'btn-scene-7',
        'btn-scene-8',
        'btn-scene-9'
    ]

    for btn_id in scenes_buttons:
        print(f"\nClicking button #{btn_id}...")
        eval_js(f"const b = document.getElementById('{btn_id}'); if (b) b.click();")
        time.sleep(1.2)

        img_info = eval_js("""
            Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.src,
                alt: img.alt,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                complete: img.complete
            }))
        """)
        if img_info:
            print(f"   Found {len(img_info)} images in DOM:")
            for img in img_info:
                filename = img['src'].split('/')[-1]
                status = "OK" if (img['naturalWidth'] > 0 and img['complete']) else "BROKEN"
                print(f"   - {filename}: {status} ({img['naturalWidth']}x{img['naturalHeight']}px)")

    # 3. Test Lightbox Modal
    print("\n3. Testing Photo Lightbox Modal...")
    eval_js("const card = document.querySelector('[data-photo-id=\"2\"]'); if (card) card.click();")
    time.sleep(0.5)
    lightbox_hidden = eval_js("document.getElementById('photo-lightbox').classList.contains('hidden')")
    lightbox_img_src = eval_js("document.getElementById('lightbox-img').src")
    lightbox_img_width = eval_js("document.getElementById('lightbox-img').naturalWidth")
    print(f"   Lightbox modal open: {not lightbox_hidden}")
    print(f"   Lightbox image: {lightbox_img_src.split('/')[-1]} ({lightbox_img_width}px wide)")

    eval_js("document.getElementById('btn-close-lightbox').click();")
    time.sleep(0.5)

    # 4. Final Comprehensive Check of All 16 Photos
    print("\n4. Final DOM check for all 16 photos across entire page:")
    all_photos = eval_js("""
        Array.from(document.querySelectorAll('img[src*="assets/photos/photo-"]')).map(img => ({
            src: img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete
        }))
    """)

    results_map = {}
    for p in all_photos:
        fn = p['src'].split('/')[-1]
        is_ok = p['naturalWidth'] > 0 and p['complete']
        results_map[fn] = (is_ok, p['naturalWidth'], p['naturalHeight'])

    print("\n--- BROWSER RENDERING RESULTS ---")
    rendered_count = 0
    for i in range(1, 17):
        fn = f"photo-{i:02d}.jpg"
        if fn in results_map:
            ok, w, h = results_map[fn]
            if ok:
                print(f"Photo #{i:02d} ({fn}): RENDERED SUCCESSFULLY ({w}x{h}px)")
                rendered_count += 1
            else:
                print(f"Photo #{i:02d} ({fn}): FAILED TO RENDER IN BROWSER")
        else:
            print(f"Photo #{i:02d} ({fn}): NOT FOUND IN DOM")

    print(f"\nTOTAL: {rendered_count}/16 real photos rendered properly in browser.")

finally:
    if ws:
        ws.close()
    proc.terminate()
