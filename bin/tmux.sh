#!/bin/sh
tmux new-session -d -s Bellhapp -n Bellhapp 
tmux set -g remain-on-exit on
tmux split-window -v 'node $HOME/Bellhapp/apps/deploy/server.js'
tmux split-window -h
tmux selectp -t 0
tmux split-window -h
tmux -2 attach-session -d 