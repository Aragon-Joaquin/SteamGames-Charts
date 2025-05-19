package utils

import (
	"strconv"
	"strings"
)

type SlicesType interface {
	[]int64 | []string
}

func SliceIntoString[T SlicesType](slice T) string {
	var steamidString []string

	if intSlice, ok := any(slice).([]int64); ok {
		for _, val := range intSlice {
			steamidString = append(steamidString, strconv.FormatInt(val, 10))
		}
	}

	if stringSlice, ok := any(slice).([]string); ok {
		steamidString = append(steamidString, stringSlice...)
	}

	return strings.Join(steamidString, ",")
}
