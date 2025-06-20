package utils

import (
	"encoding/json"
	"errors"
	"serverGo/graph/model"
)

type UnmarshalRes interface {
	*model.PBansRes | *model.FListRes | *model.UOGamesRes
}

func UnmarshalWithoutMapping[T UnmarshalRes](body *[]byte) (T, error) {
	var graphModel T

	if err := json.Unmarshal(*body, &graphModel); err != nil {
		return nil, err
	}

	return graphModel, nil
}

// ! is this necessary? it looks nasty good i like it
func UnmarshalMapping[T map[string]U, U any](wrapper T, body *[]byte, param string) (U, error) {
	var emptyVal U

	if err := json.Unmarshal(*body, &wrapper); err != nil {
		return emptyVal, err
	}

	wrapperInfo, ok := wrapper[param]

	if !ok {
		return emptyVal, errors.New("could't access the json")
	}

	return wrapperInfo, nil
}
