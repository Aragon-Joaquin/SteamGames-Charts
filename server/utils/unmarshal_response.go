package utils

import (
	"encoding/json"
	"errors"
	"reflect"
	"serverGo/graph/model"
)

type modelGraph interface {
	*model.GDetailsRes | *model.UOGamesRes | *model.PSummariesRes | *model.FListRes
}

func UnmarshalWithoutMapping[T modelGraph](graphModel T, body *[]byte, param string) (T, error) {
	var wrapper T
	if err := json.Unmarshal(*body, &wrapper); err != nil {
		return nil, err
	}

	return wrapper, nil
}

// ! is this necessary? it looks nasty good i like it
func UnmarshalMapping[T map[string]U, U modelGraph](wrapper T, body *[]byte, param string) (U, error) {
	if err := json.Unmarshal(*body, &wrapper); err != nil {
		return nil, err
	}

	wrapperInfo := wrapper[param]
	if !reflect.ValueOf(wrapperInfo).IsZero() {
		return wrapperInfo, nil
	}

	return nil, errors.New("could't access the json")
}
