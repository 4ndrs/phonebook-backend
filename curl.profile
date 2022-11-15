#!/bin/bash
# Copyright (c) 2022 4ndrs <andres.degozaru@gmail.com>
# SPDX-License-Identifier: MIT

# This file is meant to be sourced: source ./curl.profile
# functions will then be available directly in the terminal
# as commands

ENDPOINT=https://hagibook.fly.dev/api/persons
PRETTIFY=('python' '-m' 'json.tool')

#######################################
# Gets all the persons in the current server
# if an argument is supplied, it will then be
# used as the ID to get a single person
# Arguments:
#   ID of the person to get
#######################################
persons_get() {
    if [[ $# -eq 0 ]]; then
        curl -v $ENDPOINT | ${PRETTIFY[@]}
        return
    fi

    curl -v $ENDPOINT/$1 | ${PRETTIFY[@]}
}

#######################################
# Deletes a person from the current server
# Arguments:
#       ID of the person to delete
#######################################
persons_delete() {
    if [[ $# -eq 0 ]]; then
        echo 'An id is needed to send the delete request'
        return
    fi

    curl -vX DELETE $ENDPOINT/$1
    echo "\n"
}

#######################################
# Posts a new person to the server
#
# Use with heredoc:
#
# persons_post << EOF
# {
#   "name": "Iris Lotze",
#   "number": "123456"
# }
# EOF
#
# Or piping a json file:
#
# cat data.json | persons_post
#
# Or inline:
# echo '{ "name": "Sarasa Feed", "number": "123456" }' | persons_post
#
#######################################
persons_post() {
    read -d '' json
    curl -v $ENDPOINT --json $json
    echo "\n"
}
