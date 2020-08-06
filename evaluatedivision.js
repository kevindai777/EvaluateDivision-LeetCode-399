//Objective is, given equations and values for each equation,
//to find the value of each querie given

let equations = [["a", "b"], ["b", "c"]],
values = [2.0, 3.0],
queries = [["a", "c"], ["b", "a"], ["a", "e"], ["a", "a"], ["x", "x"]]


//O(n + p) where n and p are the length of the equations and queries arrays

let graph = new Map()
    
//Build the graph using each equation
//Make sure it's a bi-directional graph
for (let i = 0; i < equations.length; i++) {
    let v1 = equations[i][0]
    let v2 = equations[i][1]
    
    if (!graph.has(v1)) {
        graph.set(v1, [[v2, values[i]]])
    } else {
        graph.get(v1).push([v2, values[i]])
    }
    
    if (!graph.has(v2)) {
        graph.set(v2, [[v1, 1 / values[i]]])
    } else {
        graph.get(v2).push([v1, 1 / values[i]])
    }
}
//Map(3)
//'a' => [ [ 'b', 2 ] ],
//'b' => [ [ 'a', 0.5 ], [ 'c', 3 ] ],
//'c' => [ [ 'b', 0.3333333333333333 ] ]


let result = []

for (let i = 0; i < queries.length; i++) {
    let visited = new Map()
    let q1 = queries[i][0]
    let q2 = queries[i][1]
    
    //If the variable doesn't exist in the graph
    if (!graph.has(q1) || !graph.has(q2)) {
        result.push(-1)
        continue
    }
    
    //If the variables match
    if (q1 == q2) {
        result.push(1)
        continue
    }
    
    let node = q1
    let currPath = {}
    let queue = [...graph.get(node)]
    let isFound = false
    
    while (queue.length > 0) {
        //Represents everything in the graph for that specific character [ 'b', 2 ]
        let nextNode = queue.shift()
        
        //If visited doesn't have the letter 'b'
        if (!visited.has(nextNode[0])) {
            visited.set(nextNode[0], true)
            
            //If the letter 'b' isn't in the currentPath, add the corresponding value
            //Otherwise, multiply it by the value in the queue (2)
            currPath[nextNode[0]] = currPath[nextNode[0]] == undefined ? nextNode[1] : currPath[nextNode[0]] * nextNode[1]
            
            //If the letter corresponds to the other variable ('c')
            if (nextNode[0] == q2) {
                result.push(currPath[nextNode[0]])
                isFound = true
                break
            } else {
                let next = []
                for (let i = 0; i < graph.get(nextNode[0]).length; i++) {
                    //If we haven't reached the other variable yet, push in the next letter & value from the graph into the queue
                    //The value is calculated by multiplying the current value by the value in the graph
                    next.push([graph.get(nextNode[0])[i][0], graph.get(nextNode[0])[i][1] * nextNode[1]])
                }
                queue.push(...next)
            }
        }
    }
    //If by the end we can't reach q2 ('c')
    if (isFound == false) {
        result.push(-1)
    }
}

return result