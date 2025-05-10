package utils

import (
	"strconv"
	"strings"
)

type SlicesType interface {
	[]int | []string
}

func SliceIntoString[T SlicesType](slice T) string {
	var steamidString []string

	if intSlice, ok := any(slice).([]int); ok {
		for _, val := range intSlice {
			steamidString = append(steamidString, strconv.Itoa(val))
		}
	}

	if stringSlice, ok := any(slice).([]string); ok {
		steamidString = append(steamidString, stringSlice...)
	}

	return strings.Join(steamidString, ",")
}
