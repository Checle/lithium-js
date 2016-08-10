#!/bin/bash

RECORD="node $(readlink -f ../bin/record.js)"

cd cli

for f in *.rec; do
  $RECORD < $f
done
