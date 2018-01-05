var SliderBox = (function() {
	var defaults = {
			// CSS selectors and attributes that would be used by the JavaScript functions
			sliderBox: "slider-box",
			sliderBoxBg: "slider-box-bg",
			imgInfo: "slider-box-info"
		},
		m_slider_box,
		m_imgs,
		m_index = 0;
	
	var SliderBox = function(param) {
		var _this = this;	// js里面的this有个bug，先赋值给另一个变量就可以使用

		m_slider_box = $("#"+param.box_id);
		// 添加 Dom 修改属性
		m_slider_box.attr("class", defaults.sliderBox).attr("style", "width:"+param.width+";height:"+param.height+";");
		var html_bg = $("<div></div>", {"class": defaults.sliderBoxBg});
		var html_info = $("<div></div>", {"class": defaults.imgInfo});
		m_slider_box.append(html_bg, html_info);

		var img_info = $("."+defaults.imgInfo);
		m_imgs = m_slider_box.find("a");
		var ul_list = m_slider_box.append($("<ul></ul>")).find("ul");
		for (var i = 0; i < m_imgs.length; i++) {
			var html_li = $("<li></li>", {"text": i});
			ul_list.append(html_li);
		};

		$("a:not(:first-child)").hide();
		img_info.html(m_imgs.children(":first-child").attr('title'));


		// 添加单击事件
		m_slider_box.find("li").click(function() {
			m_index = $(this).text();
			img_info.html(m_imgs.children().eq(m_index).attr('title'));
			img_info.unbind().click(function(){window.open(m_imgs.eq(m_index).attr('href'), "_blank")})
			m_imgs.filter(":visible").fadeOut(500).parent().children().eq(m_index).fadeIn(1000);
			$(this).css({"background":"#be2424",'color':'#000'}).siblings().css({"background":"#6f4f67",'color':'#fff'});
		});

		// 自动播放
		setInterval(function(){_this.autoSlide()}, 3000);
	};

	SliderBox.prototype.autoSlide = function() {
		m_index ++;
		if (m_index >= m_imgs.length) {
			m_index = 0;
		}
		m_slider_box.find("li").eq(m_index).trigger("click");
	};
	return SliderBox;
})();

