RECORD="node $(readlink -f bin/record.js)"

cd test/cli

for f in *.rec; do
  $RECORD < $f
done
