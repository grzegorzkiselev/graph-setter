## Hard-coded layer names and their nesting:

"line-wrapper" - parent of the line chart vector

"line-value-position" - wrapper for positioning values
	"line-value" - line chart values

"bar" - frame responsible for bar height
	"wrapper" - element for positioning the value label
		"bar-value" - bar chart values.

## Line chart calculation

Formula for calculating the Y point of the vector:

```
(Height of the line from the settings)
	- (current value)
	/ (
		(maximum value)
		/ (Height of the line from the settings)
	)
```

Formula for calculating the Y value:

```
(result of previous formula) - (absolute offset value from the settings)
```

## Bar chart calculation

Formula for calculating bar height

```
(current value)
/ (
	(maximum value)
	/ (Column height from settings)
)
```

If the result is less than 0.01, then 1px will be set as the result.

If the result is less than (Bar threshold from the settings), the value label will be placed in the bottom right corner.
