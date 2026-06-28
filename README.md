# Lean symbol directory

## Generating your own categories

`abbreviations.json` defines the following schema: 

```json
{
  $ABBREVIATION: $SYMBOL,
  ...
}
```

where namely, a symbol can appear multiple times. the provided scala file can be
used to obtain a `grouped.json` that looks like:

```json
{
  $SYMBOL: {
    "abbrevs": [
      $ABBREVIATION1,
      ...
    ]
  }
}
```

this file can in turn be used with the categorizer hosted on `/cats` to write
your own categories. the final file will have the following scheme:

```json
{
  $SYMBOL: {
    "abbrevs": [
      $ABBREVIATION1,
      ...
    ],
    "cat": $CATEGORY
  }
}
```

you can use this to propose a new organization, and maybe eventually to be able
to upload and use your preferred cats.
