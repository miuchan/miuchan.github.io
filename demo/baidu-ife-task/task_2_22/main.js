(function () {
    var nodeQueue = [],
        $,
        addEvent,
        preBtn,
        inBtn,
        postBtn,
        interval


    $ = function (selector) {
        return document.querySelector(selector)
    }

    addEvent = function (ele, type, handler) {
        if (window.addEventListener) {
            addEvent = function (ele, type, handler) {
                ele.addEventListener(type, handler, false)
            }
        } else if (window.attachEvent) {
            addEvent = function (ele, type, handler) {
                ele.addEvent('on' + type, handler)
            }
        } else {
            addEvent = function (ele, type, handler) {
                ele['on' + type] = handler
            }
        }

        addEvent(ele, type, handler)
    }

    function preOrder(node, callback) {
        if (node !== null) {
            callback(node)
            if (node.firstElementChild) {
                preOrder(node.firstElementChild, callback)
            }
            if (node.lastElementChild) {
                preOrder(node.lastElementChild, callback)
            }

        }
    }

    function inOrder(node, callback) {
        if (node !== null) {

            if (node.firstElementChild) {
                inOrder(node.firstElementChild, callback)
            }
            callback(node)
            if (node.lastElementChild) {
                inOrder(node.lastElementChild, callback)
            }

        }
    }

    function postOrder(node, callback) {
        if (node !== null) {

            if (node.firstElementChild) {
                postOrder(node.firstElementChild, callback)
            }          
            if (node.lastElementChild) {
                postOrder(node.lastElementChild, callback)
            }
            callback(node)
        }
    }

    function changeColor(nodeQueue) {
        interval = setInterval(function () {
            var node = nodeQueue.shift()
            node.classList.toggle('highlight')

            if (nodeQueue.length === 0) {
                clearInterval(interval)
            }

            setTimeout(function () {
                node.classList.toggle('highlight')
            }, 500)
        }, 500)

    }


    preBtn = $('#pre-btn')
    inBtn = $('#in-btn')
    postBtn = $('#post-btn')

    addEvent(preBtn, 'click', function () {
        clearInterval(interval)
        preOrder($('.root'), function (node) {
            nodeQueue.push(node)
        })
        changeColor(nodeQueue)
    })

    addEvent(inBtn, 'click', function () {
        clearInterval(interval)
        inOrder($('.root'), function (node) {
            nodeQueue.push(node)
        })
        changeColor(nodeQueue)
    })

    addEvent(postBtn, 'click', function () {
        clearInterval(interval)
        postOrder($('.root'), function (node) {
            nodeQueue.push(node)
        })
        changeColor(nodeQueue)
    })


})()