DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

arr=$(find $DIR -type d -depth 1)

for item in $arr; do
  item=$(basename $item)
  tar czvf "${item}.tar.gz" "./${item}"
done