#!/bin/bash
echo "🔍 GITPOD PERFORMANCE MONITOR"
echo "=============================="
echo ""

while true; do
    echo "$(date): Checking performance..."
    
    # Memory usage
    MEM_USED=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    echo "Memory: ${MEM_USED}% used"
    
    # CPU load
    LOAD=$(uptime | awk -F'load average:' '{ print $2 }' | cut -d, -f1 | xargs)
    echo "Load: ${LOAD}"
    
    # VS Code processes
    VSCODE_PROCS=$(ps aux | grep -E "(node|code)" | grep -v grep | wc -l)
    echo "VS Code processes: ${VSCODE_PROCS}"
    
    # File watchers
    NODE_MODULES=$(find . -name "node_modules" -type d 2>/dev/null | wc -l)
    echo "node_modules dirs: ${NODE_MODULES}"
    
    echo "---"
    sleep 10
done
