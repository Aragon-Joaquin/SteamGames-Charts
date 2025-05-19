package utils

import (
	"encoding/json"
	"errors"
	"reflect"
)

func UnmarshalWithoutMapping[T any](graphModel T, body *[]byte) error {
	if err := json.Unmarshal(*body, &graphModel); err != nil {
		return err
	}

	return nil
}

// ! is this necessary? it looks nasty good i like it
func UnmarshalMapping[T map[string]U, U any](wrapper T, body *[]byte, param string) (U, error) {
	var emptyVal U

	if err := json.Unmarshal(*body, &wrapper); err != nil {
		return emptyVal, err
	}

	wrapperInfo := wrapper[param]
	if !reflect.ValueOf(wrapperInfo).IsZero() {
		return wrapperInfo, nil
	}

	return emptyVal, errors.New("could't access the json")
}
