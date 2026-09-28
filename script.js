class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

let root = null;
let searchResult = null;
let rotationNodes = [];

// Get height
function height(node) {
    return node ? node.height : 0;
}

// Get balance factor
function getBalance(node) {
    return node ? height(node.left) - height(node.right) : 0;
}

// Update height
function updateHeight(node) {
    node.height =
        1 + Math.max(height(node.left), height(node.right));
}

// Right Rotation
function rightRotate(y) {

    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    updateHeight(y);
    updateHeight(x);

    rotationNodes.push(x.value);

    return x;
}

// Left Rotation
function leftRotate(x) {

    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    updateHeight(x);
    updateHeight(y);

    rotationNodes.push(y.value);

    return y;
}

// Insert
function insert(node, value) {

    if (!node) {
        return new Node(value);
    }

    if (value < node.value) {
        node.left = insert(node.left, value);
    }
    else if (value > node.value) {
        node.right = insert(node.right, value);
    }
    else {
        return node;
    }

    updateHeight(node);

    let balance = getBalance(node);

    // LL
    if (balance > 1 && value < node.left.value) {
        return rightRotate(node);
    }

    // RR
    if (balance < -1 && value > node.right.value) {
        return leftRotate(node);
    }

    // LR
    if (balance > 1 && value > node.left.value) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // RL
    if (balance < -1 && value < node.right.value) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

// Find minimum node
function minValueNode(node) {

    let current = node;

    while (current.left !== null) {
        current = current.left;
    }

    return current;
}

// Delete
function remove(node, value) {

    if (!node) {
        return node;
    }

    if (value < node.value) {
        node.left = remove(node.left, value);
    }
    else if (value > node.value) {
        node.right = remove(node.right, value);
    }
    else {

        if (!node.left || !node.right) {

            let temp = node.left
                ? node.left
                : node.right;

            if (!temp) {
                node = null;
            }
            else {
                node = temp;
            }
        }
        else {

            let temp = minValueNode(node.right);

            node.value = temp.value;

            node.right =
                remove(node.right, temp.value);
        }
    }

    if (!node) {
        return node;
    }

    updateHeight(node);

    let balance = getBalance(node);

    // LL
    if (balance > 1 && getBalance(node.left) >= 0) {
        return rightRotate(node);
    }

    // LR
    if (balance > 1 && getBalance(node.left) < 0) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // RR
    if (balance < -1 && getBalance(node.right) <= 0) {
        return leftRotate(node);
    }

    // RL
    if (balance < -1 && getBalance(node.right) > 0) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

// Insert button
function insertValue() {

    let input = document.getElementById("value");
    let value = Number(input.value);

    if (input.value === "") {
        showMessage("⚠️ Please enter a value.");
        return;
    }

    rotationNodes = [];

    root = insert(root, value);

    if (rotationNodes.length > 0) {
        showMessage(
            "🔄 Rotation performed at node(s): " +
            rotationNodes.join(", ")
        );
    }
    else {
        showMessage("✅ " + value + " inserted successfully!");
    }

    searchResult = null;

    input.value = "";

    drawTree();
}

// Delete button
function deleteValue() {

    let input = document.getElementById("value");
    let value = Number(input.value);

    if (input.value === "") {
        showMessage("⚠️ Please enter a value.");
        return;
    }

    rotationNodes = [];

    root = remove(root, value);

    if (rotationNodes.length > 0) {
        showMessage(
            "🗑 " + value +
            " deleted and tree rebalanced!"
        );
    }
    else {
        showMessage(
            "🗑 Delete operation completed for " + value
        );
    }

    searchResult = null;

    input.value = "";

    drawTree();
}

// Search
function searchValue() {

    let input = document.getElementById("value");
    let value = Number(input.value);

    if (input.value === "") {
        showMessage("⚠️ Please enter a value.");
        return;
    }

    let current = root;
    let found = false;

    while (current) {

        if (current.value === value) {
            found = true;
            break;
        }

        if (value < current.value) {
            current = current.left;
        }
        else {
            current = current.right;
        }
    }

    if (found) {
        searchResult = value;

        showMessage(
            "🔍 " + value + " found in the AVL tree!"
        );
    }
    else {
        searchResult = null;

        showMessage(
            "❌ " + value + " not found!"
        );
    }

    input.value = "";

    drawTree();
}

// Reset
function resetTree() {

    root = null;
    searchResult = null;
    rotationNodes = [];

    showMessage("🔄 Tree has been reset!");

    drawTree();
}

// Message
function showMessage(message) {
    document.getElementById("message").innerHTML = message;
}

// Canvas
const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

// Draw tree
function drawTree() {

    canvas.width =
        Math.max(
            document.querySelector(".tree-container").clientWidth,
            1000
        );

    canvas.height = 500;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!root) {

        ctx.fillStyle = "#aaa";
        ctx.font = "22px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "🌱 AVL Tree is empty",
            canvas.width / 2,
            250
        );

        return;
    }

    let spacing = canvas.width / 4;

    drawNode(
        root,
        canvas.width / 2,
        70,
        spacing
    );
}

// Draw node recursively
function drawNode(node, x, y, gap) {

    if (!node) {
        return;
    }

    // Lines
    ctx.strokeStyle = "#00ffcc";
    ctx.lineWidth = 3;

    if (node.left) {

        ctx.beginPath();
        ctx.moveTo(x, y + 25);
        ctx.lineTo(x - gap, y + 90);
        ctx.stroke();

        drawNode(
            node.left,
            x - gap,
            y + 90,
            gap / 2
        );
    }

    if (node.right) {

        ctx.beginPath();
        ctx.moveTo(x, y + 25);
        ctx.lineTo(x + gap, y + 90);
        ctx.stroke();

        drawNode(
            node.right,
            x + gap,
            y + 90,
            gap / 2
        );
    }

    // Node color
    if (searchResult === node.value) {
        ctx.fillStyle = "#ff1744";
    }
    else if (rotationNodes.includes(node.value)) {
        ctx.fillStyle = "#ffea00";
    }
    else {
        ctx.fillStyle = "#00e676";
    }

    // Glow
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Node text
    ctx.fillStyle = "#111";
    ctx.font = "bold 17px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        node.value,
        x,
        y
    );

    // Height
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";

    ctx.fillText(
        "h:" + node.height,
        x,
        y + 42
    );
}

// Initial drawing
drawTree();