#!/bin/bash

# This script finds and optionally kills processes running on a specified port
PORT=${1:-4000}
KILL=${2:-no}

echo "Looking for processes using port $PORT..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    PROCESS_INFO=$(lsof -i :$PORT)
    PID=$(lsof -ti :$PORT)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    PROCESS_INFO=$(netstat -tulpn 2>/dev/null | grep ":$PORT ")
    PID=$(netstat -tulpn 2>/dev/null | grep ":$PORT " | awk '{print $7}' | cut -d'/' -f1)
else
    # Windows or other
    echo "Unsupported OS. Please check manually for processes using port $PORT."
    exit 1
fi

if [ -z "$PROCESS_INFO" ]; then
    echo "No process found using port $PORT."
    exit 0
else
    echo "Found process(es) using port $PORT:"
    echo "$PROCESS_INFO"
    
    if [ "$KILL" = "yes" ] || [ "$KILL" = "y" ]; then
        if [ -n "$PID" ]; then
            echo "Killing process(es) with PID: $PID"
            kill -9 $PID
            echo "Process(es) killed."
        else
            echo "Could not determine PID to kill."
        fi
    else
        echo ""
        echo "To kill the process(es), run:"
        if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
            echo "bash $(basename $0) $PORT yes"
            echo "Or manually: kill -9 $PID"
        fi
    fi
fi
