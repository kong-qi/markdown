!(function() {
	var KqEditor = function(options) {
		this.option = {
			obj: "",
			autoCode: true,
			autoBr: true,
			tabNumber: 4,
			fontSize: 14,
			theme: 'ace/theme/monokai',
			mode: "ace/mode/markdown",
			viewObj: "#md-viewer",
			cacheName: 'content',
			highCodeObj: 'code',
			cacheCover: 1, //缓存覆盖内容，0表示不启动缓存
			markjs: 'marker',
			scrollView: "",
			tools: "#toolbar",

			uploadImage: null, //自定义上传图片
			parentInput: '', //这里配置iframe时的input内容赋值，自动赋值。，
			localInput: "" //本地内容赋值,如果时本地，则iframe无效

		};
		//判断是否使用函数形式调用，不使用new的时候 
		if (!(this instanceof KqEditor)) {
			//console.log('我使用函数调用连接式调用');
			return new KqEditor(options);
		}
		for (var k in options) {
			if (options.hasOwnProperty(k)) {
				this.option[k] = options[k];
			}
		}

		this.init();
		return this;
	}
	var _ = KqEditor.prototype; //这里调用类的原型对象

	_.init = function() {
		var md_editor = ace.edit(this.option.obj);
		this.editor = md_editor;
		md_editor.setOptions({
			highlightActiveLine: true, //高亮
			highlightSelectedWord: true,
			enableBasicAutocompletion: true,
			enableSnippets: true,
			autoScrollEditorIntoView: true,
			enableLiveAutocompletion: this.option.autoCode, //补全
		});
		md_editor.setTheme(this.option.theme); //ace主题
		md_editor.getSession().setMode(this.option.mode); //编程语言
		md_editor.setFontSize(this.option.fontSize);
		md_editor.getSession().setTabSize(this.option.tabNumber); // 设置 Tab 为４个空格
		md_editor.getSession().setUseWrapMode(this.option.autoBr); // 自动换行
		//如果编程语言是html，就开启emment
		if (this.option.mode == 'ace/mode/html') {
			md_editor.setOption("enableEmmet", true);
		}

		var that = this;
		//文档更改时触发。
		md_editor.getSession().on('change', function(e) {
			//console.log(e)
			that.parseMark(md_editor);
			that.highCode();



		});
		//判断缓存是否存在，如果存在调用缓存
		this.loadingData(md_editor);
		this.scrollBar(md_editor);
		this.tools(md_editor);

		//return this;

	}
	//设置内容
	_.setContent=function(content){
		this.editor.setValue(content);
	}
	//取得内容，可以直接调用这个函数获取。
	_.getContent = function() {
		return this.markContent;

	}
	_.setContentInput = function(a) {
		//window.parent.body.find(a).val(this.markContent);
		parent.$(a).val(this.getContent());
	}
	_.localInput = function() {
		if (this.option.localInput) {
			$(this.option.localInput).val(this.getContent());
		}

	}
	_.autoParentInput = function() {
		if (!this.option.localInput) {
			if (this.option.parentInput) {
				parent.$(this.option.parentInput).val(this.editor.getValue());
			}
		}


	}
	_.loadingData = function(md_editor) {
		if (this.option.cacheCover) {
			var content = this.cacheData(this.option.cacheName);
			if(content)
			{
				md_editor.setValue(content);
				this.view(content);
				this.highCode();
			}
		} else {
			localStorage.clear();
		}
	}
	_.parseMark = function(md_editor) {
		var content = md_editor.getValue();
		this.markContent = content;
		this.setContentInput();
		this.localInput();
		this.autoParentInput();
		this.cacheData(this.option.cacheName, content);
		this.view(content);
	}
	_.markData = function(data) {
		// 		if (this.option.markjs == 'markdown') {
		// 			return markdown.toHTML(data);
		// 		}
		return marked(data);
	}
	_.view = function(content) {
		var data = this.markData(content);
		var viewer = $(this.option.viewObj); // 文档预览框
		viewer.html(data);
	}
	_.cacheData = function(name, data) {
		data = data || '';
		if (data) {
			localStorage.setItem(name, data);
		} else {
			return localStorage.getItem(name);
		}

	}
	_.highCode = function() {
		$(this.option.highCodeObj).each(function(i, block) {
			hljs.highlightBlock(block);
		});
	}
	//滚动监听
	_.scrollBar = function(md_editor) {
		var session = md_editor.getSession();
		var that = this;
		var scrollView = $(that.option.scrollView); // 文档预览框
		var scrollHeight = scrollView.prop('scrollHeight'); //获得预览的滚动条长度
		session.on('changeScrollTop', function() {
			var editorTop = session.getScrollTop();
			// 设置预览框的滚动条
			var scrollViewTop = scrollView.scrollTop();
			//console.log(editorTop);
			//判断是否负数
			//var nowScroll=scrollHeight-scrollViewTop;
			scrollView.scrollTop(editorTop);

		});


		// 预览框定滚动事件
		scrollView.on('scroll', function() {
			var sTop = scrollView.scrollTop();
			//取得当前的编辑器滚动高度
			//我的滚动条
			//var t=md_editor.getScrollBar.setInnerHeight;
			//console.log(scrollHeight);
			//session.setScrollTop(sTop);

		});
	}
	_.tools = function(md_editor) {
		var tools_item = $(this.option.tools + ' i');
		var that = this;
		tools_item.on('click', function() {
			//获得当前的选择
			var st = md_editor.getCursorPosition();
			var sr = md_editor.getSelectionRange();
			//console.log('getCursorPosition',st,'getSelectionRange',sr);
			var data = $(this).data('modifier');
			var type = $(this).data('type');
			type = type || '';
			//标题设置
			if (type == 'title') {
				/*
				getCursorPosition()//获取游标的当前位置。{row: 3, column: 3}column: 3row: 3__proto__: Object }
				getSelectionRange()返回所选文本的内容的返回Range
				{end: {row: 3, column: 1},start: {row: 3, column: 0}}
				navigateTo(Number row, Number column)//将光标移动到指定的行和列。请注意，这会取消选择当前选择
				moveCursorToPosition(ops)将光标移动到所指示的位置pos.row和pos.column。
				replace(String replacement, Object options)
				getTextRange(Range range)给定文档中的范围，此函数将该范围内的所有文本作为单个字符串返回
				clearSelection（）清空选择（通过取消选择）。此功能也会发出'changeSelection'事件。
				*/


				n = md_editor.getCursorPosition(); //获取游标的当前位置。
				n.column += data + 1; //第几列
				//设置位置
				md_editor.navigateTo(md_editor.getSelectionRange().start.row, 0); //将光标移动到指定的行和列。请注意，这会取消选择当前选择。
				data = "#".repeat(data) + " ";
				md_editor.insert(data); //光标位置插入
				md_editor.moveCursorToPosition(n);
				md_editor.focus();
				data = '';

				//b.event("MdHeader")

			}
			if (type == 'setStyle') {
				//取得所选位置
				n = md_editor.getSelectionRange();
				//获取游标的当前位置
				r = md_editor.getCursorPosition();
				r.column += data.length; //当前的游标位置+字符的长度，等待新的游标位置
				var new_str = data + md_editor.session.getTextRange(n) + data;
				md_editor.session.replace(n, new_str);
				md_editor.moveCursorToPosition(r);
				md_editor.selection.clearSelection();
				md_editor.focus();
				data = '';

			}
			if (type == 'setStyleNoEnd') {
				//取得所选位置
				n = md_editor.getSelectionRange();
				//获取游标的当前位置
				r = md_editor.getCursorPosition();
				r.column += data.length; //当前的游标位置+字符的长度，等待新的游标位置
				var new_str = data + md_editor.session.getTextRange(n)
				md_editor.session.replace(n, new_str);
				md_editor.moveCursorToPosition(r);
				md_editor.selection.clearSelection();
				md_editor.focus();
				data = '';

			}
			if (type == 'setStyleU') {

				//取得所选位置
				n = md_editor.getSelectionRange();
				//获取游标的当前位置
				r = md_editor.getCursorPosition();
				r.column += data.length + 2; //当前的游标位置+字符的长度，等待新的游标位置
				var new_str = '<' + data + '>' + md_editor.session.getTextRange(n) + '</' + data + '>';
				md_editor.session.replace(n, new_str);
				md_editor.moveCursorToPosition(r);
				md_editor.selection.clearSelection();
				md_editor.focus();
				data = '';

			}
			if (type == 'link') {
				//取得所选位置
				n = md_editor.getSelectionRange();
				//获取游标的当前位置
				r = md_editor.getCursorPosition();
				r.column += data.length; //当前的游标位置+字符的长度，等待新的游标位置
				var new_str = '[' + md_editor.session.getTextRange(n) + '](链接地址)'
				md_editor.session.replace(n, new_str);
				md_editor.moveCursorToPosition(r);
				md_editor.selection.clearSelection();
				md_editor.focus();
				data = '';

			}
			if (type == 'code') {
				//取得所选位置
				n = md_editor.getSelectionRange();
				//获取游标的当前位置
				r = md_editor.getCursorPosition();
				if (r.column == 0) {

					var new_str = '```\n' + md_editor.session.getTextRange(n) + '\n```'
					r.row += 1;
				} else {
					var new_str = '\n```\n' + md_editor.session.getTextRange(n) + '\n```'
					r.row += 2;
				}
				r.column += 0; //当前的游标位置+字符的长度，等待新的游标位置
				md_editor.session.replace(n, new_str);
				md_editor.moveCursorToPosition(r);
				md_editor.selection.clearSelection();
				md_editor.focus();
				data = '';

			}


			if (type.indexOf(['table']) != -1) {
				data = '\nheader 1 | header 2\n ---|---\n row 1 col 1 | row 1 col 2\n row 2 col 1 | row 2 col 2\n\n';
			}

			if (type.indexOf(['image']) != -1) {
				if (!that.option.uploadImage) {
					data = '![显示文本](图片链接地址)';
				} else {
					that.uploadImg();
				}
			}
			if (data) {
				md_editor.insert(data); //光标位置插入
			}


		});
	}
	/**
	 * 是否自定义图片上传，替换默认
	 */
	_.uploadImg = function() {

		this.option.uploadImage && this.option.uploadImage(this.editor);

	}


	//commonJs
	if (typeof exports == "object") {
		module.exports = KqEditor;
	} else if (typeof define == "function" && define.amd) {
		//amd
		define([], function() {
			return KqEditor;
		})
	} else {
		//传给window对象。
		window.KqEditor = KqEditor;
	}


})(window,jQuery,ace,marked);
