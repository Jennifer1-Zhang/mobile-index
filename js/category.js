window.onload=function () {
    new IScroll(document.querySelector('.aside'),{
        scrollX:false,
        scrollY:true
    });
    new IScroll(document.querySelector('.main'),{
        scrollX:false,
        scrollY:true
    })
}