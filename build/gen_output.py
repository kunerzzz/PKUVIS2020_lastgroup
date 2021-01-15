from jinja2 import Template
import sys
import os

if len(sys.argv) < 2:
    print("Require title")
    exit(1)

title = sys.argv[1]

cssList = [
    'css/fullpage.min.css',
    'css/fullpage.min.css.map'
]
jsList = [
    'js/jquery-3.5.1.js',
    'js/fullpage.min.js',
    'js/fullpage.min.js.map',
    'js/d3.v6.js',

    'js/fullpage_init.js'
]

cssList += map(lambda x: 'css/' + x, filter(lambda x: x[-3:] == 'css', os.listdir('css/')))
jsList += map(lambda x: 'js/' + x, filter(lambda x: x[-2:] == 'js', os.listdir('js/')))

pageList = []
fileList = list(map(lambda x: 'pages/' + x, filter(lambda x: x[-4:] == 'html', os.listdir("pages/"))))
fileList.sort()
for filename in fileList:
    with open(filename, "r") as f:
        lines = f.readlines()
        begin = 0
        end = 0
        for i, content in enumerate(lines):
            if content.count("<!-- BEGIN: DO NOT TOUCH THIS LINE -->"):
                begin = i + 1
            if content.count("<!-- END: DO NOT TOUCH THIS LINE -->"):
                end = i
        pageLines = map(lambda x: x.rstrip(), filter(lambda x: x.count('<!-- Fill Your Content Here -->') == 0, lines[begin:end]))
        pageList += list(pageLines)

tf = open("template/output_template.html", "r")
template = Template(tf.read())
tf.close()

of = open("output/index.html", "w")
of.write(template.render(title=title, jsList=jsList, cssList=cssList, pageList=pageList))


