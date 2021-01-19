# PKUVIS2020_lastgroup

## Requirements

 - python3
 - jinja2

```
pip3 install jinja2
```

## Build

### Create Page

```
make page ORDER=<oder>
```
or

```
python3 build/gen_page.py <name>
```

For example,

```
make page ORDER=1 //will create pages/page1.html

python3 build/gen_page.py test //will create pages/test.html
```



### Build Output
```
make
```
Then open output/index.html in browser to see result

**CAUTION**: 
- All Javascript files in js/ and CSS files in css/ will be used by the output html.
- Pages' order follows their filenames' dictionary order.
- Files whose name starts with underscore will not be exported to output.