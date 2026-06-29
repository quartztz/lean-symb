# Lean symbol directory

## Generating your own categories

`abbreviations.json` defines the following schema: 

```text
{
  $ABBREVIATION: $SYMBOL,
  ...
}
```

where namely, a symbol can appear multiple times. the provided scala file can be
used to obtain a `grouped.json` that looks like:

```text
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

```text
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

the scala file defines a pipeline that can be used to manage files in order to
obtain a satisfactory `grouped.json` file.

## TODOs

- [ ] maybe, more sensical categories
  - I mean i like mine but maybe that's not everyone's idea
  - [ ] custom categories? sounds like a UX nightmare
- [ ] better and more consistent handling and ordering of abbreviations for
  symbols that have more than one spelling;
- [ ] automatic updates with the source repository's `abbreviation.json`'s file.
- [ ] [detypify-like](https://detypify.quarticcat.com/) handwritten symbol
  recognition? could be a fun ML project.
