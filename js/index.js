window.onload=function () {
	// 搜素区透明度变化
	search();
	// 轮播图
	banner();
	// 倒计时秒杀
	sedskill();
}

// 搜素区：搜索区透明度随滚动距离变大而变大，到达轮播图高度后，透明度不变
var search=function () {
	// 获取dom元素
	var search=document.getElementsByClassName('search-box')[0];
	var banner=document.getElementsByClassName('banner')[0];
	var bannerHeight=banner.offsetHeight;
	//页面滚动事件
	window.onscroll=function (){
		//bug:当文档声明了<!DOCTYPE html>,则不能使用document.body.scrollTop
		// var scrollTop=document.body.scrollTop;
		var scrollTop=document.documentElement.scrollTop;
		var opacity=0;
		if(scrollTop<bannerHeight){
			opacity=scrollTop/bannerHeight*0.85;
		}else{
			opacity=0.85;
		}
		search.style.background='rgba(201,21,35,'+opacity+')';
	}
}

// 轮播图
/*1. 自动轮播图且无缝   定时器，过渡*/
/*2. 点要随着图片的轮播改变  根据索引切换类样式*/
/*3. 滑动效果  利用touch事件完成*/
/*4. 滑动结束的时候    如果滑动的距离不超过屏幕的1/3  吸附回去   过渡*/
/*5. 滑动结束的时候    如果滑动的距离超过屏幕的1/3  切换（上一张，下一张）根据滑动的方向，过渡*/
/*6.为了严谨性处理：1.触摸移动时，才开始切换图片，定义isMove;2.触摸结束时，重置参数 */
var banner=function () {
	//获取元素对象
	var bannerBox=document.querySelector(".banner");
	// 屏幕宽度
	var screenWidth=bannerBox.offsetWidth;
	// 图片容器ul
	var imageBox=bannerBox.querySelector("ul:first-child");
	// 无序列表点容器ul
	var pointBox=bannerBox.querySelector("ul:last-child");
	// 所有无序列表点
	var points=pointBox.querySelectorAll("li");
	var index=1;

	//封装函数:设置定位；设置过渡；清除过渡
	var setTranslateX=function (translateX) {
		imageBox.style.transform='translateX('+translateX+'px)';
		imageBox.style.webkitTransform='translateX('+translateX+'px)';
	}
	var setTransition=function () {
		imageBox.style.transition='all 0.2s';
		imageBox.style.webkitTransition='all 0.2s';
	}
	var clearTransition=function () {
		imageBox.style.transition='none';
		imageBox.style.webkitTransition='none';
	}
	// 1.自动轮播图且无缝
	var timer=setInterval(function (){
		index++;
		// 过渡动画
		setTransition();
		//移动位移
		setTranslateX(-index*screenWidth);
	},2000)

	//轮播图播放最后时无缝拼接处理
	imageBox.addEventListener('transitionend',function (){
		if(index>=9){
			index=1;
			// 清除过渡，实现瞬间切换图片
			clearTransition();
			//移动位移
			setTranslateX(-index*screenWidth);

		}else if(index<=0){
			index=8;
			// 清除过渡，实现瞬间切换图片
			clearTransition();
			//移动位移
			setTranslateX(-index*screenWidth);
		}
		//动画结束时点开始移动，此时index(1-8);点索引范围为index-1
		setPoint();
	})

	// 2. 点要随着图片的轮播改变:由于点是动画结束后开始移动，所以在transitionend调用该方法setPoint()
	var setPoint=function (){
		//去除所有点类样式
		for (i=0; i< points.length; i++) {
			points[i].classList.remove("now");	
		}
		//添加当前点类样式
		points[index-1].classList.add('now');
	}

	//3.滑动效果  利用touch事件完成
	var startX=0;
	var disX=0;
	var isMove=false;
	//手指开始位置：记录初始位置
	imageBox.addEventListener('touchstart',function (e){
		//手指开始触摸时，清除定时器
		clearInterval(timer);
	 	startX=e.touches[0].clientX;
	})
	//手指移动位置：ul轮播图随手指改变位移
	imageBox.addEventListener('touchmove',function (e){
		var moveX=e.touches[0].clientX;
		//移动距离
		disX=moveX-startX;
		//移动位置:清除过渡动画，使ul随手指顺畅滑动
		var translateX=(-index*screenWidth)+disX;
		clearTransition();
		setTranslateX(translateX);
		isMove=true;
	})
	
	//手指结束位置：根据索引切换图片
	imageBox.addEventListener('touchend',function (e){
		if(isMove){
			if(Math.abs(disX)<screenWidth*1/3){
				/*4. 滑动结束的时候    如果滑动的距离不超过屏幕的1/3  吸附回去   过渡*/
				setTransition();
				setTranslateX(-index*screenWidth);
			}else{
				/*5. 滑动结束的时候    如果滑动的距离超过屏幕的1/3  切换（上一张，下一张）根据滑动的方向，过渡*/
				if(disX<0){
					index++;
				}else if(disX>0){
					index--;
				}
				setTransition();
				setTranslateX(-index*screenWidth);
			}
		}
		//重置参数
		startX=0;
		disX=0;
		isMove=false;
		//手指触摸结束后，重新开启定时器
		timer=setInterval(function (){
			index++;
			// 过渡动画
			setTransition();
			//移动位移
			setTranslateX(-index*screenWidth);
		},2000)
	})


}

//秒杀倒计时
var sedskill=function (){
	//获取span元素
	var spans=document.querySelector('.sedskill .time').querySelectorAll('span');
	//设置默认倒计时长
	var time=2*60*60;
	var timer=setInterval(function (){
		time--;
		var h=Math.floor(time/3600);
		var m=Math.floor(time%3600/60);
		var s=Math.floor(time%60);
		spans[0].innerHTML=Math.floor(h/10);
		spans[1].innerHTML=h%10;
		spans[3].innerHTML=Math.floor(m/10);
		spans[4].innerHTML=m%10;
		spans[6].innerHTML=Math.floor(s/10);
		spans[7].innerHTML=s%10;
		if(time<=0){
			clearInterval(timer);
		}
	},1000)
}