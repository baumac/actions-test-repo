
NUM_TAGS=998

for i in $(seq ${NUM_TAGS}); do
  echo "Creating tag ${i}"
	git tag 0.0.${i}
done

# Uncomment the below block to delete the created tags
#for i in $(seq ${NUM_TAGS}); do
#  echo "Deleting tag ${i}"
#	git tag -d 0.0.${i}
#done
