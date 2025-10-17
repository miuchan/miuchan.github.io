(function () {
    var nodeQueue = [],
        $,
        addEvent,
        traverseDFBtn,
        traverseBFBtn,
        searchDFBtn,
        searchBFBtn,
        searchInput,
        timer


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

    function traverseDF(node, callback) {
        for (var i = 0, length = node.children.length; i < length; i++) {
            traverseDF(node.children[i], callback)
        }


        if (typeof callback === 'function') {
            callback(node)
        }

    }

    function traverseBF(node, callback) {
        var queue = [],
            currentTree
        queue.push(node)
        currentTree = queue.shift()

        while (currentTree) {
            for (var i = 0, length = currentTree.children.length; i < length; i++) {
                queue.push(currentTree.children[i])
            }
            if (typeof callback === 'function') {
                callback(currentTree)
            }
            currentTree = queue.shift()
        }
    }

    function changeColor(nodeQueue, searchValue) {
        var found = false,
            className

        timer = setInterval(function () {
            var node = nodeQueue.shift()

            if (searchValue && node.dataset.name.trim() === searchValue.trim()) {
                found = true
                className = 'search-result'
                nodeQueue = []
                clearInterval(timer)
            } else {
                className = 'highlight'
            }

            node.classList.toggle(className)
            console.log(node.className)

            if (node.classList.contains('highlight')) {
                setTimeout(function () {
                    node.classList.remove('highlight')
                    console.log(node.className)
                }, 300)
            }

            if (nodeQueue.length === 0) {
                if (searchValue && !found) {
                    alert('未找到节点！')
                }
                clearInterval(timer)
            }

        }, 300)


    }


    traverseDFBtn = $('#traverseDF-btn')
    traverseBFBtn = $('#traverseBF-btn')
    searchDFBtn = $('#searchDF-btn')
    searchBFBtn = $('#searchBF-btn')
    searchInput = $('#search')

    addEvent(traverseDFBtn, 'click', function () {
        clearInterval(timer)
        nodeQueue = []
        traverseDF($('.supper'), function (node) {
            nodeQueue.push(node)
        })
        changeColor(nodeQueue)
    })

    addEvent(traverseBFBtn, 'click', function () {
        clearInterval(timer)
        nodeQueue = []
        traverseBF($('.supper'), function (node) {
            nodeQueue.push(node)
        })
        changeColor(nodeQueue)
    })

    addEvent(searchDFBtn, 'click', function () {
        var searchValue = searchInput.value
        clearInterval(timer)
        nodeQueue = []
        traverseDF($('.supper'), function (node) {
            nodeQueue.push(node)
            node.classList.remove('search-result')
        })
        changeColor(nodeQueue, searchValue)
    })

    addEvent(searchBFBtn, 'click', function () {
        var searchValue = searchInput.value
        clearInterval(timer)
        nodeQueue = []
        traverseBF($('.supper'), function (node) {
            nodeQueue.push(node)
            node.classList.remove('search-result')
        })
        changeColor(nodeQueue, searchValue)
    })

} ())