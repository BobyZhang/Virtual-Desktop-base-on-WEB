
/*****************************************
  Get element by id, className and tagName
 ****************************************/
var get = {
    byId: function (id) {
        // if _id is string return the element
        return typeof id === "string" ? document.getElementById(id) : id
    },
    byClass: function (sClass, oParent) {
        var aClass = [];
        var reClass = new RegExp("(^| )" + sClass + "( |$)");
        var aElem = this.byTagName("*", oParent);
        // yinjiqiqiao  If the second operand is obj, just when the first operand is ture, rentrun obj
        for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
        return aClass
    },
    byTagName: function (elem, obj) {
        return (obj || document).getElementsByTagName(elem)
    }
};


/***************************************
    drag 
***************************************/

function drag(_windows) {

    // disX = the distance of point to window's edge
    var disX = disY = 0;

    // get node
    var wTitle = _windows.getElementsByClassName("title")[0];
    var wMin = wTitle.getElementsByClassName("min")[0];
    var wMax = wTitle.getElementsByClassName("max")[0];
    var wRevert = wTitle.getElementsByClassName("revert")[0];
    var wClose = wTitle.getElementsByClassName("close")[0];

    wTitle.onmousedown = function (event) {
        // get event
        var event = event || window.event;

        // disX = the distance of point to window's edge
        disX = event.clientX - _windows.offsetLeft;
        disY = event.clientY - _windows.offsetTop;

        // When mousedown and mousemove
        document.onmousemove = function (event) {
            // get event
            var event = event || window.event;

            // cLeft = the changed left position
            var cLeft = event.clientX - disX;
            var cTop = event.clientY - disY;
            

            // limit the movable range (left and top)
            cLeft <= 0 && (cLeft = 0);
            cTop <= 0 && (cTop = 0);
            // limit the movable range (right and buttom)
            var rightRange = document.documentElement.clientWidth
                             - _windows.offsetWidth;
            var bottomRange = document.documentElement.clientHeight
                              - _windows.offsetHeight;
            cLeft > rightRange && (cLeft = rightRange);
            cTop > bottomRange && (cTop = bottomRange);

            // set position
            _windows.style.left = cLeft + "px";
            _windows.style.top = cTop + "px";

            return false;
        }

        // When mouseup
        document.onmouseup = function (event) {
            // init
            document.onmousemove = null;
            document.onmouseup = null;
        }

        return false;
    }

    // click max
    wMax.onclick = function () {
        // set size
        _windows.style.width = document.documentElement.clientWidth - 2 + "px";
        _windows.style.height = document.documentElement.clientHeight - 2 + "px";
        // set position
        _windows.style.left = 0;
        _windows.style.top = 0;
        // switch icon
        this.style.display = "none";
        wRevert.style.display = "Block";
    }

    // click revert
    wRevert.onclick = function () {
        // set size
        _windows.style.width = minWindowsWidth + "px";
        _windows.style.height = minWindowsHeight + "px";
        // set position
        _windows.style.left = (document.documentElement.clientWidth - _windows.offsetWidth) / 2 + "px";
        _windows.style.top = (document.documentElement.clientHeight - _windows.offsetHeight) / 2 + "px";
        // switch icon
        this.style.display = "none";
        wMax.style.display = "Block";
    }

    // click min and close
    wMin.onclick = function () {
        _windows.style.display = "none";
        var wA = document.createElement("a");
        wA.className = "open";
        wA.href = "javascript:;";
        wA.title = "Revert";
        document.body.appendChild(wA);
        wA.onclick = function () {
            _windows.style.display = "block";
            document.body.removeChild(this);
            this.onclick = null;
        };
    };
}

/*******************************************
    Resize
********************************************/

function resize(_windows, _handle, isLeft, isTop, lockX, lockY) {
    // 
    _handle.onmousedown = function (event) {
        // get event
        var event = event || window.event;

        // record position and size
        var windowLeft   =  _windows.offsetLeft;
        var windowTop    =  _windows.offsetTop;
        var windowWidth  =  _windows.offsetWidth;
        var windowHeight =  _windows.offsetHeight;

        // disX = the distance of point to window's edge
        var disX = event.clientX - _handle.offsetLeft;
        var disY = event.clientY - _handle.offsetTop;

        document.onmousemove = function (event) {
            // get event
            var event = event || window.event;

            // cLeft = the changed position
            var cLeft = event.clientX - disX;
            var cTop = event.clientY - disY;

            // finLeft = finaly position
            var finLeft = windowLeft + cLeft;
            var finTop = windowTop + cTop;

            // limit the left and top direction
            finLeft < 0 && (finLeft = 0);
            finTop < 0 && (finTop = 0);

            // if left and top resize, change the position
            isLeft && (_windows.style.left = finLeft + "px");
            isTop && (_windows.style.top = finTop + "px");

            // cWidth = changed size
            var cWidth = isLeft ? windowWidth - cLeft : _handle.offsetWidth + cLeft;
            var cHeight = isTop ? windowHeight - cTop : _handle.offsetHeight + cTop;

            // maxW use to limit right and bottom direction
            var maxW = document.documentElement.clientWidth - _windows.offsetLeft;
            var maxH = document.documentElement.clientHeight - _windows.offsetTop;

            // change size
            cWidth < minWindowsWidth && (cWidth = minWindowsWidth);
            cWidth > maxW && (cWidth = maxW);
            lockX || (_windows.style.width = cWidth + "px");

            cHeight < minWindowsHeight && (cHeight = minWindowsHeight);
            cHeight > maxH && (cHeight = macH);
            lockY || (_windows.style.height = cHeight + "px");

            // TODO
            if ((isLeft && iW == minWindowsWidth) || (isTop && iH == minWindowsHeight)) {
                document.onmousemove = null;
            }

            return false;
        }

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false;
        
    }

}

/******************************************
  A function to band event
 ******************************************/

function windowBandEvent(_windows) {
    drag(_windows);

    // direction
    //var wL = _windows.getElementsByClassName("resizeL")[0];
    //var wR = _windows.getElementsByClassName("resizeR")[0];
    //var wT = _windows.getElementsByClassName("resizeT")[0];
    //var wB = _windows.getElementsByClassName("resizeB")[0];
    //var wLT = _windows.getElementsByClassName("resizeLT")[0];
    //var wLB = _windows.getElementsByClassName("resizeLB")[0];
    //var wRT = _windows.getElementsByClassName("resizeRT")[0];
    //var wRB = _windows.getElementsByClassName("resizeRB")[0];
    var wL = get.byClass("resizeL", _windows)[0];
    var wR = get.byClass("resizeR", _windows)[0];
    var wT = get.byClass("resizeT", _windows)[0];
    var wB = get.byClass("resizeB", _windows)[0];
    var wLT = get.byClass("resizeLT", _windows)[0];
    var wLB = get.byClass("resizeLB", _windows)[0];
    var wRT = get.byClass("resizeRT", _windows)[0];
    var wRB = get.byClass("resizeRB", _windows)[0];

    resize(_windows, wL, true, false, false, true);
    resize(_windows, wT, false, true, true, false);
    resize(_windows, wR, false, false, false, true);
    resize(_windows, wB, false, false, true, false);
    resize(_windows, wLT, true, true, false, false);
    resize(_windows, wRT, false, true, false, false);
    resize(_windows, wRB, false, false, false, false);
    resize(_windows, wLB, true, false, false, false);
}


// set min and max
var minWindowsWidth = 300;
var minWindowsHeight = 170;
var maxWindowsWidth = document.documentElement.clientWidth;
var maxWindowsHeight = document.documentElement.clientHeight;

window.onload = window.onresize = function () {

    var wDrag = document.getElementsByClassName("windows")[0];

    windowBandEvent(wDrag);

    

}