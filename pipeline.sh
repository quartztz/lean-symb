#!/bin/sh

set -e
export LC_ALL=en_US.UTF-8

scala process.scala -- clean abbreviations.json grouped-abbr.json
scala process.scala -- merge grouped-abbr.json grouped-cats.json
scala process.scala -- group grouped-cats.json grouped.json