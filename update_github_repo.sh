#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  Civic Pluse AI: Automated GitHub Repository Rebrand     "
echo "=========================================================="

python3 -c '
import os

replacements = [
    ("JanSetu AI does not replace", "Civic Pluse AI does not replace"),
    ("Meet JanSetu AI", "Meet Civic Pluse AI"),
    ("JanSetu AI — Hackathon Pitch", "Civic Pluse AI — Hackathon Pitch"),
    ("JanSetu AI — Streamlit", "Civic Pluse AI — Streamlit"),
    ("JanSetu AI", "Civic Pluse AI"),
    ("JanSetuAI", "CivicPluseAI"),
    ("JanSetu", "Civic Pluse AI"),
    ("JANSETU AI", "CIVIC PLUSE AI"),
    ("JANSETU", "CIVIC PLUSE AI"),
    ("Civic Pulse is an independent AI assistant", "Civic Pluse AI is an independent AI assistant"),
    ("Civic Pulse", "Civic Pluse AI"),
    ("Civic pulse", "Civic Pluse AI"),
    ("civic pulse", "Civic Pluse AI"),
    ("Ask Civic Pulse", "Ask Civic Pluse AI"),
]

modified = 0
for root, _, files in os.walk("."):
    if ".git" in root or "node_modules" in root:
        continue
    for f in files:
        fpath = os.path.join(root, f)
        try:
            with open(fpath, "r", encoding="utf-8") as fh:
                content = fh.read()
            new_content = content
            for src, dst in replacements:
                new_content = new_content.replace(src, dst)
            if new_content != content:
                with open(fpath, "w", encoding="utf-8") as fh:
                    fh.write(new_content)
                modified += 1
                print("Rebranded:", fpath)
        except Exception:
            pass
print(f"\nSuccessfully rebranded {modified} files to Civic Pluse AI.")
'

git add -A
git commit -m "chore: rebrand project to Civic Pluse AI and integrate Google Gemini 2.5 Flash"
echo "Commit created! Run 'git push origin main' to push to GitHub."
