#!/bin/bash

PACKAGE_NAME=${PACKAGE:-'none'}

CI_JOB_NAME_LN=${#CI_JOB_NAME}
CI_JOB_STAGE_LN=${#CI_JOB_STAGE}
PACKAGE_NAME_LN=${#PACKAGE_NAME}
STAGE_LN=${#STAGE}
REGION_LN=${#REGION}
AWS_ACCESS_KEY_ID_LN=${#AWS_ACCESS_KEY_ID}


LARGEST=$CI_JOB_NAME_LN
for LN in $CI_JOB_STAGE_LN $PACKAGE_NAME_LN $STAGE_LN $REGION_LN $AWS_ACCESS_KEY_ID_LN; do
  if [ "$LN" -gt "$LARGEST" ]; then
    LARGEST=$LN
  fi
done

NUM=$((LARGEST + 4))

printf '###################' && printf '#%.0s' $(seq 1 $NUM) && printf '#\n'
printf '#                  ' && printf ' %.0s' $(seq 1 $NUM) && printf '#\n'
printf '#    Running a CI job in the' && printf ' %.0s' $(seq 1 $((NUM - 9))) && printf '#\n'
printf '#    following environment:' && printf ' %.0s' $(seq 1 $((NUM - 8))) && printf '#\n'
printf '#                  ' && printf ' %.0s' $(seq 1 $NUM) && printf '#\n'
printf "#    JOB NAME      %s" "${CI_JOB_NAME}" && printf ' %.0s' $(seq 1 $((NUM - CI_JOB_NAME_LN))) && printf '#\n'
printf "#    JOB STAGE:    %s" "${CI_JOB_STAGE}" && printf ' %.0s' $(seq 1 $((NUM - CI_JOB_STAGE_LN))) && printf '#\n'
printf '#                  ' && printf ' %.0s' $(seq 1 $NUM) && printf '#\n'
printf "#    PACKAGE:      %s" "${PACKAGE_NAME}" && printf ' %.0s' $(seq 1 $((NUM - PACKAGE_NAME_LN))) && printf '#\n'
printf '#                  ' && printf ' %.0s' $(seq 1 $NUM) && printf '#\n'
printf "#    STAGE:        %s" "${STAGE}" && printf ' %.0s' $(seq 1 $((NUM - STAGE_LN))) && printf '#\n'
printf "#    REGION:       %s" "${REGION}" && printf ' %.0s' $(seq 1 $((NUM - REGION_LN))) && printf '#\n'
printf "#    AWS KEY ID:   %s" "${AWS_ACCESS_KEY_ID}" && printf ' %.0s' $(seq 1 $((NUM - AWS_ACCESS_KEY_ID_LN))) && printf '#\n'
printf '#                  ' && printf ' %.0s' $(seq 1 $NUM) && printf '#\n'
printf '###################' && printf '#%.0s' $(seq 1 $NUM) && printf '#\n'
