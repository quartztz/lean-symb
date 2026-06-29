#!/bin/sh

scala pipeline.scala -- clean abbreviations.json grouped-abbr.json
scala pipeline.scala -- merge grouped-abbr.json grouped-cats.json
scala pipeline.scala -- group grouped-cats.json grouped.json