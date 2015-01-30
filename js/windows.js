
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


//
// OO part
//

function Windows() {

    // create the node
    this.node = document.createElement("div");
    this.node.className = "windows";
    this.node.innerHTML = windowsHTML;
    document.getElementsByTagName("body")[0].appendChild(this.node);

    // some attribute
    this.isMax = false;    // mark the window if the window is maximize status
    this.zIndex = ++maxIndex;    // about z-index

    // set zIndex
    this.node.style.zIndex = this.zIndex;
}

/***************************************
    drag 
***************************************/
Windows.prototype.drag = function () {

    var _windows = this.node;

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

Windows.prototype.resize = function (_windows, _handle, isLeft, isTop, lockX, lockY) {
    // 
    _handle.onmousedown = function (event) {
        // get event
        var event = event || window.event;

        // record position and size
        var windowLeft = _windows.offsetLeft;
        var windowTop = _windows.offsetTop;
        var windowWidth = _windows.offsetWidth;
        var windowHeight = _windows.offsetHeight;

        // disX = the distance of point to window's edge
        var disX = event.clientX - _handle.offsetLeft;
        var disY = event.clientY - _handle.offsetTop;

        document.onmousemove = function (event) {
            // get event
            var event = event || window.event;


            // cLeft = the changed position
            var cLeft = event.clientX - disX;
            var cTop = event.clientY - disY;

            // when the size is min, can'nt move windows
            var minLeft = windowLeft + windowWidth - minWindowsWidth;
            var minTop = windowTop + windowHeight - minWindowsHeight;

            // finLeft = finaly position
            var finLeft = windowLeft + cLeft;
            var finTop = windowTop + cTop;

            // limit the left and top direction
            finLeft < 0 && (finLeft = 0);
            finTop < 0 && (finTop = 0);
            // limit move, when the size can small
            finLeft > minLeft && (finLeft = minLeft);
            finTop > minTop && (finTop = minTop);

            // set position
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
            if (event.clientX > 0) lockX || (_windows.style.width = cWidth + "px");

            cHeight < minWindowsHeight && (cHeight = minWindowsHeight);
            cHeight > maxH && (cHeight = maxH);
            if (event.clientY > 0) lockY || (_windows.style.height = cHeight + "px");

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
   Index event
 *****************************************/

Windows.prototype.indexEvent = function () {

    var _windows = this.node;
    alert(_windows);

    this.node.onmousedown = function () {
        // changed scoping, so this.style not this.node.style
        this.style.zIndex = ++maxIndex;

    }

}

/******************************************
  A function to band event for window
 ******************************************/

Windows.prototype.windowBandEvent = function () {

    var _windows = this.node;

    // drag function
    this.drag();
    // control z-index
    this.indexEvent();

    // direction
    var wL = get.byClass("resizeL", _windows)[0];
    var wR = get.byClass("resizeR", _windows)[0];
    var wT = get.byClass("resizeT", _windows)[0];
    var wB = get.byClass("resizeB", _windows)[0];
    var wLT = get.byClass("resizeLT", _windows)[0];
    var wLB = get.byClass("resizeLB", _windows)[0];
    var wRT = get.byClass("resizeRT", _windows)[0];
    var wRB = get.byClass("resizeRB", _windows)[0];

    // resize function
    this.resize(_windows, wL, true, false, false, true);
    this.resize(_windows, wT, false, true, true, false);
    this.resize(_windows, wR, false, false, false, true);
    this.resize(_windows, wB, false, false, true, false);
    this.resize(_windows, wLT, true, true, false, false);
    this.resize(_windows, wRT, false, true, false, false);
    this.resize(_windows, wRB, false, false, false, false);
    this.resize(_windows, wLB, true, false, false, false);
}

//
//
// So named main
//
//

// set min and max
var minWindowsWidth = 300;
var minWindowsHeight = 170;
var maxWindowsWidth = document.documentElement.clientWidth;
var maxWindowsHeight = document.documentElement.clientHeight;

// windowsHTML
var windowsHTML = "<div class=\"title\"><h2>This is a movable window</h2><div class=\"operation\"><a class=\"min\" href=\"javascript:;\" title=\"minimize\"></a><a class=\"max\" href=\"javascript:;\" title=\"maximize\"></a><a class=\"revert\" href=\"javascript:;\" title=\"revert\"></a><a class=\"close\" href=\"javascript:;\" title=\"close\"></a></div></div><div class=\"content\">1. This window is movable <br />2. This window is resizable from eight directions <br />3. Support Minimize, Maxinize, Revert and Close <br />4. Limit the minWidth and minHeight <br /></div><div class=\"resizeL\"></div><div class=\"resizeR\"></div><div class=\"resizeT\"></div><div class=\"resizeB\"></div><div class=\"resizeLT\"></div><div class=\"resizeLB\"></div><div class=\"resizeRT\"></div><div class=\"resizeRB\"></div>";

// max index
var maxIndex = 1;  // mark the 

window.onload = window.onresize = function () {

    //var wDrag = document.getElementsByClassName("windows")[0];

    //windowBandEvent(wDrag);
    var newWindows = new Windows();
    newWindows.windowBandEvent();
}

