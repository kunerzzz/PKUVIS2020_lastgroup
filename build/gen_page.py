from jinja2 import Template
import sys
import os

if len(sys.argv) < 2:
    print("Require page name")
    exit(1)

pageName = sys.argv[1]

tf = open("template/page_template.html", "r")
template = Template(tf.read())
tf.close()

filename = "pages/{}.html".format(pageName)
if os.path.exists(filename):
    print("Error: {} exists".format(filename))
    exit(1)

of = open(filename, "w")
of.write(template.render(pageName=pageName))
of.close()


