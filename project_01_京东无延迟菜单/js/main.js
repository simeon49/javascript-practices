$(document).ready(function () {
    var cate = $('#cate'),
        cateMenu = $('#cate-menu'),
        catePop = $('#cate-pop');   //  $('.cate_pop').first() or $('.cate_pop:first')
    
    var activeMenuItem = null,
        activePopIem = null,
        timer = null,
        mouseInPop = false;
        mouseTrack = [];

    function mouseMoveHanler(e) {
        mouseTrack.push({
            x: e.pageX,
            y: e.pageY
        })
        if (mouseTrack.length > 3) {
            mouseTrack.shift();
        }
    }

    function needDelay() {
        var catePopTopLeftPos = {
            x: catePop.offset().left,
            y: catePop.offset().top,
        }
        var catePopBottomLeftPos = {
            x: catePop.offset().left,
            y: catePop.offset().top + catePop.height()
        }
        currMousePos = mouseTrack[mouseTrack.length - 1];
        preMousePos = mouseTrack[mouseTrack.length - 2];
        // console.log(currMousePos, preMousePos, catePopTopLeftPos, catePopBottomLeftPos);
        return isPointInTriangle(currMousePos, preMousePos, catePopTopLeftPos, catePopBottomLeftPos);
    }
    

    cate.on('mouseenter', function (e) {
        catePop.removeClass('none');
        $(document).bind('mousemove', mouseMoveHanler);
    }).on('mouseleave', function (e) {
        catePop.addClass('none');
        $(document).unbind('mousemove', mouseMoveHanler);
    });

    catePop.on('mouseenter', function (e) {
        mouseInPop = true;
    }).on('mouseleave', function (e) {
        mouseInPop = false;
    })

    cateMenu.on('mouseover', 'li', function (e) {
        if (!activeMenuItem) {
            activeMenuItem = $(e.target).addClass('active');
            activePopIem = $('#' + activeMenuItem.data('id'));
            activePopIem.removeClass('none');
        } else {
            clearTimeout(timer);
            if (needDelay()) {
                console.log('delay');
                timer = setTimeout(() => {
                    if (mouseInPop) {
                        return;
                    }
                    activeMenuItem.removeClass('active');
                    activePopIem.addClass('none');

                    activeMenuItem = $(e.target).addClass('active');
                    activePopIem = $('#' + activeMenuItem.data('id'));
                    activePopIem.removeClass('none');
                }, 300);
            } else {
                console.log('----')
                activeMenuItem.removeClass('active');
                activePopIem.addClass('none');

                activeMenuItem = $(e.target).addClass('active');
                activePopIem = $('#' + activeMenuItem.data('id'));
                activePopIem.removeClass('none');
            }
            
            
        }
    });
})