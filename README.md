# markdown
自己动手做个markdown,web编辑器；Do it yourself, markdown, web editor,瞎打的英文。
### 如何使用
> 文件说明
```
drwxr-xr-x 1 kongqi 197121    0 12月  5 06:33 css/	//样式
-rw-r--r-- 1 kongqi 197121  944 12月  5 06:55 iframe.html //iframe例子
-rw-r--r-- 1 kongqi 197121 4460 12月  5 06:55 iframe_editor.html iframe使用编辑器文件
drwxr-xr-x 1 kongqi 197121    0 12月  5 06:37 images/ 图片图标
-rw-r--r-- 1 kongqi 197121 4585 12月  5 06:55 index.html
drwxr-xr-x 1 kongqi 197121    0 12月  5 06:32 js/	
-rw-r--r-- 1 kongqi 197121 1084 12月  5 07:05 LICENSE
-rw-r--r-- 1 kongqi 197121   95 12月  5 07:05 README.md

```
1. js/KqEditor.js，主要的编辑器文件  
2. 依赖jquery,marked,ace  

> 初始化
```
<script type="text/javascript">
	var editor = KqEditor({
		obj: 'editor',//编辑器实力的对象，这里不需要加#
		cacheCover: 1,
		viewObj: "#preview",//预览对象的HTML id
		scrollView: "#preview-warp",//预览对象滚动条的HTML id
		localInput: "#edinput", //本地设置把编辑器内容同步到input里面
		//theme:"ace/theme/tomorrow",
		//上传图片自己写,ed返回的时编辑器的实例,最后用ed.insert('内容');
		// 				uploadImage:function(ed){
		// 					
		// 				}
	});
	//editor.setContentInput();
</script>
```
> 引入文件
1.style 
```
	<link rel="stylesheet" type="text/css" href="http://www.heibaiketang.com/style/bootstrap/css/bootstrap.css"><!--bootstrap样式，我这里用了我自己编译过的，不使用也可以-->
	<link href="http://cdn.bootcss.com/highlight.js/8.0/styles/monokai_sublime.min.css" rel="stylesheet"><!--ACE编辑器样式-->
	<link rel="stylesheet" type="text/css" href="css/editor.css" /><!--编辑器必选样式-->
```
2.js
```
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
<script src="http://cdn.bootcss.com/highlight.js/8.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.1/ace.js"></script>
<script src="https://cdn.bootcss.com/marked/0.5.1/marked.min.js"></script>
```
3.html 编辑器
```
<body class="kq-editor">
	<div class="ui-layout-north">
		<span id="toolbar" class="noselect" data-open-title="Hide Toolbar" data-closed-title="Show Toolbar">
			<i title="Bold" class="svg-icon svg-bold styling-icon" data-type="setStyle" data-modifier="****">
			</i>
			<i title="Italic" class="svg-icon svg-italic styling-icon" data-type="setStyle" data-modifier="**">
			</i>
			<i title="Strikethrough" class="svg-icon svg-strikethrough styling-icon" data-type="setStyle" data-modifier="~~">
			</i>
			<i title="Insert" class="svg-icon svg-underline styling-icon" data-type="setStyleU" data-modifier="u">
			</i>

			<i class="dividor"></i>
			<i title="Heading 1" class="svg-icon svg-heading1 heading-icon" data-type="title" data-modifier="1">
			</i>
			<i title="Heading 2" class="svg-icon svg-heading2 heading-icon" data-type="title" data-modifier="2">
			</i>
			<i title="Heading 3" class="svg-icon svg-heading3 heading-icon" data-type="title" data-modifier="3">
			</i>
			<i title="Heading 4" class="svg-icon svg-heading4 heading-icon" data-type="title" data-modifier="4">
			</i>
			<i title="Heading 5" class="svg-icon svg-heading5 heading-icon" data-type="title" data-modifier="5">
			</i>
			<i title="Heading 6" class="svg-icon svg-heading6 heading-icon" data-type="title" data-modifier="6">
			</i>
			<i class="dividor"></i>
			<i title="Horizontal rule" class="svg-icon svg-hr" data-type="br" data-modifier="***">
			</i>
			<i title="Quote" class="svg-icon svg-quote list-icon" data-type="setStyleNoEnd" data-modifier="> ">
			</i>
			<i title="Unordered list" class="svg-icon svg-ul list-icon" data-type="setStyleNoEnd" data-modifier="-">
			</i>
			<i title="Ordered list" class="svg-icon svg-ol list-icon" data-type="setStyleNoEnd" data-modifier="1. ">
			</i>

			<i class="dividor"></i>
			<i title="Link" class="svg-icon svg-link" id="link-icon" data-type="link" data-modifier="[提示文本](链接地址)">
			</i>
			<i title="Image" class="svg-icon svg-image" id="image-icon" data-type="image">
			</i>
			<i title="Code" class="svg-icon svg-code" data-type="code" data-modifier="">
			</i>
			<i title="Table" class="svg-icon svg-table" id="table-icon" data-type="table" data-modifier="">
			</i>
			<i class="dividor"></i>

			<!-- <i title="theme" class="svg-icon svg-theme theme-icon">
			</i> -->
			
		</span>
	</div>

	<div class="ui-layout-toggler" id="north-toggler"></div>
	<div class="ui-layout-south">
		<div class="ui-layout-center">
			<div id="editor"></div> <!-- 编辑器 -->
		</div>
		<div class="ui-layout-toggler" id="east-toggler"></div>
		<div class="ui-layout-east" id="preview-warp">
			<article class="markdown-body" id="preview" data-open-title="Hide Preview" data-closed-title="Show Preview"></article>
			<!-- 实时预览 -->
		</div>
	</div>

	<h4>编辑器内容</h4>
	<textarea rows="6" cols="" class="form-control" id="edinput"></textarea>
</body>
```
前面ui-layout-north这个时编辑器的工具html,如果不想要，直接删除。绑定工具哪里去掉或者是忽略

### 获得编辑器内容
```
content=editor.getContent();//函数获取
console.log(content);
console.log(editor.markContent);//属性获取
```
### 设置内容
```
$("#setWrite").click(function(){

				editor.setContent('### 黑白课堂[进入](http//:www.heibaiketang.com)');
				
			})
```
### iframe里面如何使用呢
```
<div class="iframe">

	<iframe id="fm" name="myFrame" src="iframe_editor.html" frameborder="0" height="500" width="100%"></iframe>
	<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>

</div>
<div class="container-fluid">
	<h4>编辑器内容</h4>
	<textarea rows="6" cols="" class="form-control" id="markdownValue"></textarea>
</div>
```
直接应用即可，在iframe_editor.html配置下参数即可试下。
```
<script type="text/javascript">
	var editor = KqEditor({
		obj: 'editor',
		cacheCover: 1,
		viewObj: "#preview",
		scrollView: "#preview-warp",
		parentInput: '#markdownValue', //就是这里了。默认我写了这个。
		//theme:"ace/theme/tomorrow",
		//上传图片自己写,ed返回的时编辑器的实例,最后用ed.insert('内容');
		// 				uploadImage:function(ed){
		// 					
		// 				}
	});
	//editor.setContentInput();
</script>
```
### iframe赋值
```
window.frames["myFrame"].editor.setContent('### 黑白课堂[进入](http//:www.heibaiketang.com)');
```

本文为原创，作者主页：[黑白课堂](http://www.heibaiketang.com)www.heibaiketang.com。
演示地址:[演示进入](http://www.heibaiketang.com/tools/markdown)www.heibaiketang.com/tools/markdown  
git演示地址:https://kong-qi.github.io/markdown/，https://kong-qi.github.io/markdown/iframe.html
