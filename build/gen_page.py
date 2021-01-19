from jinja2 import Template
import sys
import os

if len(sys.argv) < 2:
    print("Require page name")
    exit(1)

pageName = sys.argv[1]

iFileName = {"html": "template/page_template.html", "js": "template/pagejs_template.js", "css": "template/pagecss_template.css"}
oFileName = {
    "html": "pages/{}.html".format(pageName), 
    "js": "js/{}.js".format(pageName), 
    "css": "css/{}.css".format(pageName)
}

ok = True
for _, fn in oFileName.items():
    if os.path.exists(fn):
        print("Error: {} exists".format(fn))
        ok = False
if not ok:
    exit(1)

for k in ("html", "js", "css"):
    tf = open(iFileName[k], "r")
    template = Template(tf.read())
    tf.close()

    of = open(oFileName[k], "w")
    of.write(template.render(pageName=pageName))
    of.close()


