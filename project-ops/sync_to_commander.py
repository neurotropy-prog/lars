#!/usr/bin/env python3
"""
Sync all LARS sessions + prompts to the Commander API.
Run from anywhere: python3 sync_to_commander.py
"""
import json
import os
import urllib.request
import urllib.error

# ── Redirect handler for POST ──
class PostRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        """Follow redirects for POST requests (urllib skips them by default)"""
        new_req = urllib.request.Request(
            newurl,
            data=req.data,
            headers=dict(req.headers),
            method=req.get_method()
        )
        return new_req

# ── Config ──
API_URL = "https://project-ops.vercel.app/api/sync/project"
API_KEY = "cmdr_06a3e38c4180c38c7884e9e19f62041ea735458aa1bd5d30c4434731c0acf2da"

# Paths relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_JSON = os.path.join(SCRIPT_DIR, "projects", "lars", "project.json")
PROMPTS_DIR = os.path.join(SCRIPT_DIR, "projects", "lars", "prompts")

def read_prompt(prompt_file):
    path = os.path.join(PROMPTS_DIR, os.path.basename(prompt_file))
    if os.path.exists(path):
        with open(path, 'r') as f:
            return f.read()
    return None

def build_payload():
    with open(PROJECT_JSON, 'r') as f:
        project = json.load(f)

    sprints = []
    for sprint in project.get('sprints', []):
        tasks = []
        prompt_content = None

        for task in sprint.get('tasks', []):
            tasks.append({
                "id": task.get('id', ''),
                "description": task.get('title', task.get('description', '')),
                "status": task.get('status', 'pending'),
                "started_at": task.get('started_at'),
                "completed_at": task.get('completed_at'),
                "notes": task.get('notes', '')
            })
            if not prompt_content and task.get('prompt_file'):
                prompt_content = read_prompt(task['prompt_file'])

        sprints.append({
            "index": sprint['index'],
            "name": sprint['name'],
            "description": sprint.get('description', ''),
            "status": sprint.get('status', 'pending'),
            "started_at": sprint.get('started_at'),
            "completed_at": sprint.get('completed_at'),
            "tasks": tasks,
            "prompt_content": prompt_content
        })

    return {
        "slug": "lars-project",
        "name": project.get('name', 'L.A.R.S.©'),
        "description": project.get('description', ''),
        "sprints": sprints
    }

if __name__ == '__main__':
    print("=== Sync LARS to Commander ===\n")

    payload = build_payload()
    print(f"Project: {payload['name']}")
    print(f"Slug: {payload['slug']}")
    print(f"Sprints: {len(payload['sprints'])}")
    print(f"With prompts: {sum(1 for s in payload['sprints'] if s.get('prompt_content'))}")
    print(f"Completed: {sum(1 for s in payload['sprints'] if s['status'] == 'completed')}")

    data = json.dumps(payload, ensure_ascii=False).encode('utf-8')
    print(f"Payload: {len(data):,} bytes\n")

    req = urllib.request.Request(
        API_URL,
        data=data,
        headers={
            'Content-Type': 'application/json',
            'x-commander-key': API_KEY,
            'x-commander-source': 'cowork'
        },
        method='POST'
    )

    opener = urllib.request.build_opener(PostRedirectHandler)
    print("Sending...")
    try:
        with opener.open(req, timeout=120) as resp:
            body = json.loads(resp.read().decode('utf-8'))
            print(f"\n✅ Status: {resp.status}")
            print(json.dumps(body, indent=2))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        print(f"\n❌ HTTP {e.code}: {e.reason}")
        print(body)
    except Exception as e:
        print(f"\n❌ Error: {e}")
