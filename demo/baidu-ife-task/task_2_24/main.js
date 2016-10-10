(function () {
    var nodeQueue = [],
        $,
        addEvent,
        supperNode,
        traverseDFBtn,
        traverseBFBtn,
        searchDFBtn,
        searchBFBtn,
        input,
        timer,
        selectedNode



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



    supperNode = $('.supper')
    traverseDFBtn = $('#traverseDF-btn')
    traverseBFBtn = $('#traverseBF-btn')
    searchDFBtn = $('#searchDF-btn')
    searchBFBtn = $('#searchBF-btn')
    addBtn = $('#add-btn')
    removeBtn = $('#remove-btn')
    input = $('#input')

    addEvent(traverseDFBtn, 'click', function () {
        clearInterval(timer)
        nodeQueue = []
        traverseDF(supperNode, function (node) {
            nodeQueue.push(node)
        })
        changeColor(nodeQueue)
    })

    addEvent(traverseBFBtn, 'click', function () {
        clearInterval(timer)
        nodeQueue = []
        traverseBF(supperNode, function (node) {
            nodeQueue.push(node)
        })
        changeColor(nodeQueue)
    })

    addEvent(searchDFBtn, 'click', function () {
        var searchValue = input.value
        clearInterval(timer)
        nodeQueue = []
        traverseDF(supperNode, function (node) {
            nodeQueue.push(node)
            node.classList.remove('search-result')
        })
        changeColor(nodeQueue, searchValue)
    })

    addEvent(searchBFBtn, 'click', function () {
        var searchValue = input.value
        clearInterval(timer)
        nodeQueue = []
        traverseBF(supperNode, function (node) {
            nodeQueue.push(node)
            node.classList.remove('search-result')
        })
        changeColor(nodeQueue, searchValue)
    })

    addEvent(supperNode, 'click', function (e) {
        if (selectedNode) {
            selectedNode.classList.toggle('selected')
        }
        selectedNode = e.target
        e.target.classList.toggle('selected')
    })

    addEvent(removeBtn, 'click', function () {
        selectedNode.parentNode.removeChild(selectedNode)
        selectedNode = null
    })

    addEvent(addBtn, 'click', function () {
        var childNode = document.createElement('div'),
            value = input.value
        childNode.className = value
        childNode.dataset.name = value
        childNode.innerText = value
        selectedNode.appendChild(childNode)
    })

} ())