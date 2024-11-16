const svg = document.getElementById('graph');
const nodes = [
    { id: 1, x: 100, y: 100 },
    { id: 2, x: 300, y: 100 },
    { id: 3, x: 100, y: 300 },
    { id: 4, x: 300, y: 300 },
    { id: 5, x: 200, y: 200 }
];
const edges = [
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 2, target: 4 },
    { source: 3, target: 4 },
    { source: 5, target: 1 }
];

let selectedNode = null;

function drawGraph() {
    svg.innerHTML = ''; // Reset the graph
    // Draw edges
    edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sourceNode.x);
        line.setAttribute('y1', sourceNode.y);
        line.setAttribute('x2', targetNode.x);
        line.setAttribute('y2', targetNode.y);
        line.classList.add('edge');
        svg.appendChild(line);
    });

    // Draw nodes
    nodes.forEach(node => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', 20);
        circle.classList.add('node');
        circle.setAttribute('data-id', node.id);
        circle.addEventListener('click', () => selectNode(node));
        svg.appendChild(circle);

        // Add label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.textContent = node.id;
        svg.appendChild(text);
    });
}

function selectNode(node) {
    if (selectedNode) {
        document.querySelector(`.node[data-id="${selectedNode.id}"]`).classList.remove('active');
    }
    selectedNode = node;
    document.querySelector(`.node[data-id="${node.id}"]`).classList.add('active');
    document.getElementById('info').innerText = `Selected node: ${node.id}`;
}

function highlightNode(nodeId) {
    const node = document.querySelector(`.node[data-id="${nodeId}"]`);
    node.classList.add('active');
    node.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.2)' },
        { transform: 'scale(1)' }
    ], {
        duration: 500,
        iterations: 1
    });
}

async function dfs(startNodeId) {
    const speed = document.getElementById('speed').value;
    const stack = [startNodeId];
    const visited = new Set();
    while (stack.length) {
        const nodeId = stack.pop();
        if (!visited.has(nodeId)) {
            visited.add(nodeId);
            highlightNode(nodeId);
            await sleep(speed);
            const neighbors = edges.filter(e => e.source === nodeId || e.target === nodeId);
            neighbors.forEach(edge => {
                const neighborId = edge.source === nodeId ? edge.target : edge.source;
                stack.push(neighborId);
            });
        }
    }
}

async function bfs(startNodeId) {
    const queue = [startNodeId];
    const visited = new Set();
    while (queue.length) {
        const nodeId = queue.shift();
        if (!visited.has(nodeId)) {
            visited.add(nodeId);
            highlightNode(nodeId);
            await sleep(1000);
            const neighbors = edges.filter(e => e.source === nodeId || e.target === nodeId);
            neighbors.forEach(edge => {
                const neighborId = edge.source === nodeId ? edge.target : edge.source;
                queue.push(neighborId);
            });
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listeners for the start buttons
document.getElementById('startDFS').addEventListener('click', () => {
    if (selectedNode) {
        dfs(selectedNode.id);
    }
});

document.getElementById('startBFS').addEventListener('click', () => {
    if (selectedNode) {
        bfs(selectedNode.id);
    }
});

document.getElementById('addNode').addEventListener('click', () => {
    const newNodeId = nodes.length + 1;
    nodes.push({ id: newNodeId, x: Math.random() * 800, y: Math.random() * 600 });
    
    // Check if a node is selected to create an edge
    if (selectedNode) {
        edges.push({ source: selectedNode.id, target: newNodeId });
        alert(`Edge added between node ${selectedNode.id} and node ${newNodeId}.`);
    } else {
        alert("Select an existing node to create an edge!");
    }

    drawGraph(); // Redraw the graph
});

// Draw the graph
drawGraph();
